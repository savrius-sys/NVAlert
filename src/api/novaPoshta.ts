export interface TrackingDocument {
  Number: string;
  Status: string;
  StatusCode: string;
  CitySender?: string;
  CityRecipient?: string;
  DocumentWeight?: string;
  DateCreated?: string;
  ScheduledDeliveryDate?: string;
  RecipientFullName?: string;
  SenderFullName?: string;
  WarehouseRecipient?: string;
  WarehouseSender?: string;
  DocumentCost?: string;
  AmountToPay?: string;
}

export interface NPResponse {
  success: boolean;
  data: TrackingDocument[];
  errors: string[];
  warnings: string[];
  info: string[];
}

export const fetchTrackingStatus = async (
  apiKey: string = '',
  ttnNumbers: string[]
): Promise<TrackingDocument[]> => {
  if (ttnNumbers.length === 0) {
    return [];
  }

  const payload = {
    apiKey: apiKey,
    modelName: 'TrackingDocument',
    calledMethod: 'getStatusDocuments',
    methodProperties: {
      Documents: ttnNumbers.map((ttn) => ({
        DocumentNumber: ttn,
        Phone: ''
      })),
    },
  };

  const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Nova Poshta API error: ${response.statusText}`);
  }

  const result: NPResponse = await response.json();

  if (!result.success) {
    throw new Error(result.errors.join(', ') || 'Failed to fetch tracking data');
  }

  return result.data;
};
