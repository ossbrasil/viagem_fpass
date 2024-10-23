import {AccessLevel} from "@/core/enums/access-level";

export interface User {
    id: string;
    cpf: string;
    name: string;
    email: string;
    departmentId: string;
    subDepartmentId: string;
    accessLevel: AccessLevel;
}