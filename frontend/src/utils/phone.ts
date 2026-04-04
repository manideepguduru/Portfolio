// Phone number privacy utility - obfuscates phone numbers while keeping them clickable

export const phoneUtils = {
  /**
   * Format phone number for display
   * Example: +91 93469 29001 -> +91 ***** 29001
   */
  obfuscate: (phone: string): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters temporarily
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length < 4) return phone;
    
    // Keep first 2 and last 4 digits visible
    const hidden = '*'.repeat(digits.length - 6);
    
    // Reconstruct with formatting
    return `+${digits.substring(0, 2)} ${hidden} ${digits.substring(digits.length - 4)}`;
  },

  /**
   * Validate phone number format
   */
  isValid: (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  },

  /**
   * Format phone for WhatsApp link
   */
  formatForWhatsApp: (phone: string): string => {
    return phone.replace(/\D/g, '');
  },

  /**
   * Format phone for display with country code
   */
  formatDisplay: (phone: string, obfuscate = false): string => {
    if (!phone) return '';
    
    const digits = phone.replace(/\D/g, '');
    
    if (obfuscate) {
      return phoneUtils.obfuscate(phone);
    }

    // Standard formatting: +CC ######## ####
    if (digits.length === 10) {
      return `+91 ${digits.substring(0, 5)} ${digits.substring(5)}`;
    }
    
    if (digits.length === 12 && digits.startsWith('91')) {
      return `+91 ${digits.substring(2, 7)} ${digits.substring(7)}`;
    }

    return phone;
  },
};
