export interface Message{
    id:number;
    sender:string;
    message:string;
    date:string;
    email:string;
    status:'Read' | 'Replied' | 'New';
}