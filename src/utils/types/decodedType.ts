import User from "../../database/models/User";

export interface decodedType extends User {
    roles: Array<string>,
}
