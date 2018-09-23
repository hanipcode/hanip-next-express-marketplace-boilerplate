export type ProductTypeModel = {
  _id: string,
  name: string,
};

export type ProductTypePayload = {
  name: string,
};

export type ProductTypeCreateParam = {
  name: string,
  userId: string,
};
