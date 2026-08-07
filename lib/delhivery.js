// Delhivery courier integration. Same base URLs, request/response shapes,
// and field mapping as the working implementation in the Amairah Perfumes
// project, adapted to plain server-side functions.

function getConfig() {
  const token = process.env.DELHIVERY_API_TOKEN;
  const pickupLocation = process.env.DELHIVERY_PICKUP_LOCATION;
  const isSandbox = process.env.DELHIVERY_SANDBOX === "true" || process.env.DELHIVERY_SANDBOX === "1";

  if (!token) throw new Error("Delhivery is not configured — DELHIVERY_API_TOKEN is missing.");
  if (!pickupLocation) throw new Error("Delhivery is not configured — DELHIVERY_PICKUP_LOCATION is missing.");

  return {
    token,
    pickupLocation,
    baseUrl: isSandbox ? "https://staging-express.delhivery.com" : "https://track.delhivery.com",
  };
}

async function submitShipment(baseUrl, token, delhiveryData) {
  const body = new URLSearchParams();
  body.append("format", "json");
  body.append("data", JSON.stringify(delhiveryData));

  const response = await fetch(`${baseUrl}/api/cmu/create.json`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const responseText = await response.text();
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    throw new Error(`Delhivery API returned a non-JSON response (status ${response.status}): ${responseText.slice(0, 150)}`);
  }

  const firstPkg = responseData.packages?.[0];
  const waybill = firstPkg?.waybill;

  if (!response.ok || !waybill || firstPkg?.status === "Fail") {
    const errorMsg =
      firstPkg?.remarks?.[0] ||
      (typeof responseData.error === "string" ? responseData.error : null) ||
      responseData.rmk ||
      responseData.detail ||
      responseData.message ||
      (responseData.packages || []).map((p) => p.remarks?.join(", ")).filter(Boolean).join("; ") ||
      "Failed to create Delhivery shipment (no waybill returned)";
    throw new Error(errorMsg);
  }

  return { waybill, trackingUrl: `https://www.delhivery.com/track/package/${waybill}`, raw: responseData };
}

// POST /api/cmu/create.json — creates a shipment and returns a waybill
// number. `order` needs { id, order_number, payment_method, total_amount },
// `address` needs { full_name, address_line_1, address_line_2, city, state,
// postal_code, phone }.
export async function createShipment({ order, address, weightKg, lengthCm, widthCm, heightCm }) {
  const { token, pickupLocation, baseUrl } = getConfig();

  const isCod = order.payment_method === "COD";
  const delhiveryData = {
    pickup_location: { name: pickupLocation },
    shipments: [
      {
        name: address.full_name,
        add: [address.address_line_1, address.address_line_2].filter(Boolean).join(", "),
        pin: address.postal_code,
        city: address.city,
        state: address.state,
        phone: address.phone || "9999999999",
        payment_mode: isCod ? "COD" : "Prepaid",
        order: order.order_number,
        cod_amount: isCod ? Math.round(order.total_amount) : 0,
        package_weight: weightKg,
        package_length: lengthCm,
        package_width: widthCm,
        package_height: heightCm,
        product_desc: "Tailoring / Garments",
      },
    ],
  };

  return submitShipment(baseUrl, token, delhiveryData);
}

// POST /api/cmu/create.json with payment_mode: "Pickup" — books a reverse
// pickup that collects a package FROM the customer (their reference garment
// or own fabric) and routes it back to our store via the return_* fields.
// Without return_* fields Delhivery would route it to the generic warehouse
// address tied to `pickup_location` instead, so those are required here.
// `address` is the CUSTOMER's pickup address (where the courier collects
// from), not the delivery address.
export async function createReversePickup({ order, address, weightKg, lengthCm, widthCm, heightCm }) {
  const { token, pickupLocation, baseUrl } = getConfig();

  const returnName = process.env.DELHIVERY_RETURN_NAME || pickupLocation;
  const returnAdd = process.env.DELHIVERY_RETURN_ADDRESS;
  const returnCity = process.env.DELHIVERY_RETURN_CITY;
  const returnState = process.env.DELHIVERY_RETURN_STATE;
  const returnPin = process.env.DELHIVERY_RETURN_PIN;
  const returnPhone = process.env.DELHIVERY_RETURN_PHONE;

  if (!returnAdd || !returnCity || !returnState || !returnPin || !returnPhone) {
    throw new Error(
      "Reverse pickup is not configured — set DELHIVERY_RETURN_ADDRESS, DELHIVERY_RETURN_CITY, DELHIVERY_RETURN_STATE, DELHIVERY_RETURN_PIN and DELHIVERY_RETURN_PHONE."
    );
  }

  const delhiveryData = {
    pickup_location: { name: pickupLocation },
    shipments: [
      {
        name: address.full_name,
        add: [address.address_line_1, address.address_line_2].filter(Boolean).join(", "),
        pin: address.postal_code,
        city: address.city,
        state: address.state,
        phone: address.phone || "9999999999",
        payment_mode: "Pickup",
        order: order.order_number,
        package_weight: weightKg,
        package_length: lengthCm,
        package_width: widthCm,
        package_height: heightCm,
        product_desc: "Reference garment / fabric for tailoring",
        return_name: returnName,
        return_add: returnAdd,
        return_city: returnCity,
        return_state: returnState,
        return_pin: returnPin,
        return_phone: returnPhone,
        return_country: "India",
      },
    ],
  };

  return submitShipment(baseUrl, token, delhiveryData);
}

// GET /api/v1/packages/json/?waybill= — live scan history + status.
export async function trackShipment(waybill) {
  const { token, baseUrl } = getConfig();

  const response = await fetch(`${baseUrl}/api/v1/packages/json/?waybill=${encodeURIComponent(waybill)}`, {
    headers: { Authorization: `Token ${token}` },
  });

  if (!response.ok) throw new Error("Delhivery tracking API call failed.");
  return response.json();
}

// GET /c/api/pin-codes/json/?pincode= — serviceability check.
export async function checkServiceability(pincode) {
  const { token, baseUrl } = getConfig();

  const response = await fetch(`${baseUrl}/c/api/pin-codes/json/?pincode=${encodeURIComponent(pincode)}`, {
    headers: { Authorization: `Token ${token}` },
  });

  if (!response.ok) throw new Error("Delhivery serviceability check failed.");
  return response.json();
}
