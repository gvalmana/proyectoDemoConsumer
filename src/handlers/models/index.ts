export interface Product {
  id: string;
  precio: number;
  idCompany: string;
}

export interface Journal {
  idResource: string;
  resourceType: string;
  date: string;
  number: string;
  company: Company;
  debit: JournalInfo[];
  credit: JournalInfo[];
}

export interface Company {
  id: string;
}

export interface JournalInfo {
  idCostCenter?: string;
  idCategory: string;
  idClient: string;
  amount: number;
  idConcept?: string;
  concept?: string;
  conceptAmount?: string;
  conceptAmountSecondaryCurrency?: string;
  currency: Currency;
}
export interface JournaCreditlInfo extends JournalInfo {
  currency: Currency;
}

export interface JournaDebitlInfo extends JournalInfo {
  currency: Currency;
}
export interface Currency {
  companyCurrencyValues: CompanyCurrencyValues;
}

export interface CompanyCurrencyValues {
  amount: number;
}
