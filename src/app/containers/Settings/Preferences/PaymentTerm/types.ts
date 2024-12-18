export interface PaymentTermsProps {
  bool: boolean;
  edit?: boolean;
  current?: any;
  paymentModal: boolean;
  onFinish: (values: any) => void;
  toggle?: boolean;
  handleToggle: any;
  setPaymentData?: any;
}
