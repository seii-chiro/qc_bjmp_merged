import {
  NonPdlVisitorReasonVisit,
  PersonnelStatus,
  PersonnelType,
  Relationship,
} from "./definitions";
import { BASE_URL } from "./urls";

export async function getPersonnelTypes(
  token: string
): Promise<PersonnelType[]> {
  const res = await fetch(`${BASE_URL}/api/codes/personnel-type/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Personnel Type data.");
  }

  return res.json();
}

export async function getPersonnelStatuses(
  token: string
): Promise<PersonnelStatus[]> {
  const res = await fetch(`${BASE_URL}/api/codes/personnel-status/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Personnel Status data.");
  }

  return res.json();
}

export async function getNonPdlVisitorReasons(
  token: string
): Promise<NonPdlVisitorReasonVisit[]> {
  const res = await fetch(
    `${BASE_URL}/api/non-pdl-visitor/non-pdl-reason-visits/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Reasons data.");
  }

  return res.json();
}

export async function getRelationships(token: string): Promise<Relationship[]> {
  const res = await fetch(`${BASE_URL}/api/pdls/relationship/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Relationships data.");
  }

  return res.json();
}
