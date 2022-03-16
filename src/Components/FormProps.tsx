import { FormAlertData } from '../common';

export interface FormProps<T> {
    data?: T;
    onSubmit: (place: T) => void;
    loading?: boolean;
    alert?: FormAlertData
    editMode?: boolean
}
