// WhatsApp click-to-chat generator for ZOX

export function formatWhatsAppPhone(phone) {
  let clean = String(phone || '').replace(/\D/g, '');
  if (!clean) return '';
  if (clean.length === 10) {
    clean = `91${clean}`;
  }
  return clean;
}

export function createWhatsAppUrl(phone, message) {
  const cleanPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function generateRentalInvoiceMessage(rental, settings) {
  const currency = settings?.currency || '₹';
  return (
    `Hello ${rental.customer_name},\n\n` +
    `Thank you for choosing ${settings?.store_name || 'ZOX'}. Your rental invoice *${rental.invoice_number}* for *${currency}${rental.total_amount}* is ready.\n\n` +
    `• Item: ${rental.item_name} (${rental.item_category || 'Suit'})\n` +
    `• Rental Period: ${rental.rental_start} to ${rental.rental_end} (${rental.duration_days} Days)\n` +
    `• Amount Paid: ${currency}${rental.amount_paid}\n` +
    `• Pending Balance: ${currency}${rental.pending_amount}\n\n` +
    `Please keep the return date (${rental.rental_end}) in mind. Thank you!`
  );
}

export function generateSaleInvoiceMessage(sale, settings) {
  const currency = settings?.currency || '₹';
  const itemNames = (sale.items || []).map(i => `${i.item_name} (x${i.quantity})`).join(', ');

  return (
    `Hello ${sale.customer_name},\n\n` +
    `Thank you for shopping at ${settings?.store_name || 'ZOX'}! Your invoice *${sale.invoice_number}* for *${currency}${sale.total_amount}* is ready.\n\n` +
    `• Items Purchased: ${itemNames}\n` +
    `• Total Savings / Discount: ${currency}${sale.total_discount || 0}\n` +
    `• Amount Paid: ${currency}${sale.amount_paid}\n` +
    `• Pending Balance: ${currency}${sale.pending_amount || 0}\n\n` +
    `We appreciate your visit and look forward to serving you again.`
  );
}

export function generateReturnReminderMessage(rental, isOverdue = false, settings) {
  if (isOverdue) {
    return (
      `Hello ${rental.customer_name}, this is ${settings?.store_name || 'ZOX'}.\n\n` +
      `Our records show that your rented *${rental.item_name}* (Invoice: *${rental.invoice_number}*) was due for return on *${rental.rental_end}*.\n\n` +
      `Please contact us to arrange its return. Thank you.`
    );
  }

  return (
    `Hello ${rental.customer_name}, this is ${settings?.store_name || 'ZOX'}.\n\n` +
    `This is a friendly reminder that your rented *${rental.item_name}* (Invoice: *${rental.invoice_number}*) is due to be returned on *${rental.rental_end}*.\n\n` +
    `Please contact us if you need any assistance. Thank you for choosing ZOX.`
  );
}
