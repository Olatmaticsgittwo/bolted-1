import jsPDF from 'jspdf';

interface TransactionData {
  id: string;
  customerName: string;
  customerEmail: string;
  transactionType: 'buy' | 'sell';
  cryptoType: string;
  cryptoAmount: number;
  usdAmount: number;
  paymentMethod: string;
  walletAddress?: string;
  timestamp: string;
}

export const generateTransactionReceipt = (transaction: TransactionData): jsPDF => {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [59, 130, 246]; // Blue
  const secondaryColor = [107, 114, 128]; // Gray
  const successColor = [34, 197, 94]; // Green
  
  // Header with logo area
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Add logo if available
  try {
    // In a real implementation, you would load the logo image
    // For now, we'll use text-based branding
  } catch (error) {
    console.log('Logo not loaded, using text branding');
  }
  
  // Company name with enhanced styling
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('🏦 BIANOTRADES', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Cryptocurrency Exchange Platform', 20, 32);
  
  // Receipt title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION RECEIPT', 20, 55);
  
  // Status badge
  doc.setFillColor(successColor[0], successColor[1], successColor[2]);
  doc.roundedRect(150, 45, 40, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SUCCESSFUL', 155, 53);
  
  // Transaction details box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(20, 70, 170, 80);
  
  // Transaction details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  let yPos = 85;
  const lineHeight = 12;
  
  // Transaction ID
  doc.text('Transaction ID:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.id, 80, yPos);
  
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Name:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.customerName, 80, yPos);
  
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.customerEmail, 80, yPos);
  
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Type:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(transaction.transactionType === 'buy' ? 34 : 239, transaction.transactionType === 'buy' ? 197 : 68, transaction.transactionType === 'buy' ? 94 : 68);
  doc.text(transaction.transactionType.toUpperCase(), 80, yPos);
  
  yPos += lineHeight;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Cryptocurrency:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.cryptoType, 80, yPos);
  
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Crypto Amount:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${transaction.cryptoAmount.toFixed(8)} ${transaction.cryptoType}`, 80, yPos);
  
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('USD Amount:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${transaction.usdAmount.toLocaleString()}`, 80, yPos);
  
  // Payment method box
  doc.setFillColor(249, 250, 251);
  doc.rect(20, 160, 170, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, 160, 170, 25);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Method:', 25, 175);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.paymentMethod, 80, 175);
  
  // Wallet address (if applicable)
  if (transaction.walletAddress) {
    yPos = 195;
    doc.setFont('helvetica', 'bold');
    doc.text('Wallet Address:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(transaction.walletAddress, 25, yPos + 8);
  }
  
  // Timestamp
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Date & Time:', 25, 220);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.timestamp, 80, 220);
  
  // Footer
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 250, 210, 47, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('BIANOTRADES Inc.', 20, 265);
  doc.text('158 Market Street, Suite 437', 20, 272);
  doc.text('San Francisco, CA 94047, United States', 20, 279);
  doc.text('Email: bianotrades@hotmail.com | Instagram: @bianotrades', 20, 286);
  
  // Security notice
  doc.setFontSize(8);
  doc.text('This is a computer-generated receipt. No signature required.', 20, 293);
  
  return doc;
};

export const downloadReceipt = (transaction: TransactionData) => {
  const doc = generateTransactionReceipt(transaction);
  const fileName = `BIANOTRADES_Receipt_${transaction.id}.pdf`;
  doc.save(fileName);
  return doc;
};