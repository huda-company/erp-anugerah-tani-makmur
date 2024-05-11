export enum Gender {
  Male = "male",
  Female = "female",
}

export interface IRoleDocument extends Document {
  codeName: string;
  displayName: string;
  created: Date;
  removed: boolean;
}

export interface IRoleFieldRequest {
  sort: {
    key: "name";
    direction: string;
  };
  query: {
    name: string;
    id?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    startDate?: Date;
    endDate?: Date;
    "sort[key]"?: IRoleFieldRequest["sort"]["key"];
    "sort[direction]"?: IRoleFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: number;
  // Add other sorting options as needed
}
