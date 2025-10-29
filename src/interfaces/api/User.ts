export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}