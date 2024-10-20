export interface UserProfile{
    id: number;
    userId?: number;
    image:string;
    username:string;
    firstName: string;
    lastName: string;
    email:string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    accessLevelId: number;
    dateCreate: string;
    dateEdit: string; 
}