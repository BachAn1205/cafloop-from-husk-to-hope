import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'vi' | 'en';

type TranslationKeys =
  | 'navCircular'
  | 'navSub'
  | 'navAudioOn'
  | 'navAudioOff'
  | 'navAudioToggle'
  | 'heroBadge'
  | 'heroTitleLine1'
  | 'heroTitleLine2'
  | 'heroSubtext'
  | 'heroMusicTitle'
  | 'heroMusicOn'
  | 'heroMusicOff'
  | 'heroBtnOrder'
  | 'heroBtnLearn'
  | 'heroScrollDown'
  | 'esgBadge'
  | 'esgTitle'
  | 'esgSubtitle'
  | 'esgCardHuskTitle'
  | 'esgCardHuskDesc'
  | 'esgCardCO2Title'
  | 'esgCardCO2Desc'
  | 'esgCycleTitle'
  | 'esgCycleZeroWaste'
  | 'esgCycleStep1Title'
  | 'esgCycleStep1Desc'
  | 'esgCycleStep2Title'
  | 'esgCycleStep2Desc'
  | 'esgCycleStep3Title'
  | 'esgCycleStep3Desc'
  | 'impactBadge'
  | 'impactTitle'
  | 'impactSchool'
  | 'impactImgBadgeTitle'
  | 'impactImgBadgeDesc'
  | 'impactImgBadgeSeason'
  | 'impactQuote'
  | 'impactFundProgress'
  | 'impactPhase'
  | 'impactTargetTitle'
  | 'impactCompleted'
  | 'impactRemaining'
  | 'impactBikesTitle'
  | 'impactBikesDesc'
  | 'impactTVsTitle'
  | 'impactTVsDesc'
  | 'impactTransparency'
  | 'storyBadge'
  | 'storyTitle'
  | 'storySub'
  | 'storyCardBadge'
  | 'storyCardTitle'
  | 'storyCardDesc'
  | 'storyHighlight1Title'
  | 'storyHighlight1Desc'
  | 'storyHighlight2Title'
  | 'storyHighlight2Desc'
  | 'storyHighlight3Title'
  | 'storyHighlight3Desc'
  | 'storyBtnDonate'
  | 'storyBadgeClean'
  | 'storyBadgeAdditive'
  | 'storyBadgeTransparent'
  | 'ctaBadge'
  | 'ctaTitle'
  | 'ctaDesc'
  | 'ctaBtnShare'
  | 'ctaBtnCopy'
  | 'ctaBtnCopied'
  | 'ctaBtnDonate'
  | 'ctaCounterPrefix'
  | 'ctaCounterSuffix'
  | 'modalSuccessTitle'
  | 'modalSuccessDesc'
  | 'modalSuccessDirectImpact'
  | 'modalSuccessImpactDesc'
  | 'modalSuccessBtnDone'
  | 'modalFundraiseYear'
  | 'modalPreorderTitle'
  | 'modalPreorderSub'
  | 'modalItemName'
  | 'modalItemPrice'
  | 'modalFieldName'
  | 'modalFieldNamePlaceholder'
  | 'modalFieldPhone'
  | 'modalFieldPhonePlaceholder'
  | 'modalFieldAddress'
  | 'modalFieldAddressPlaceholder'
  | 'modalSummaryLabel'
  | 'modalFreeship'
  | 'modalBtnConfirm'
  | 'footerDesc'
  | 'footerPartner'
  | 'footerToTop'
  | 'footerCopyright'
  | 'footerSlogan'
  | 'floatingAudioOn'
  | 'floatingAudioOff'
  | 'floatingSupport'
  | 'donateModalTitle'
  | 'donateModalSub'
  | 'donateFieldAmount'
  | 'donateFieldAmountPlaceholder'
  | 'donateBtnNext'
  | 'donateQRTitle'
  | 'donateQRSub'
  | 'donateBtnDone';

const translations: Record<Language, Record<TranslationKeys, string>> = {
  vi: {
    navCircular: 'Tuần Hoàn',
    navSub: 'From Husk to Hope',
    navAudioOn: "T'rưng đang vang",
    navAudioOff: 'Âm thanh Tây Nguyên',
    navAudioToggle: "Bật/Tắt âm thanh Đàn T'rưng",
    heroBadge: 'CAFLOOP • FROM HUSK TO HOPE',
    heroTitleLine1: 'Từ Vỏ Cà Phê Đến',
    heroTitleLine2: 'Tương Lai Ngời Sáng',
    heroSubtext: 'Thưởng thức Trà Cascara CAFLOOP - Cùng chung tay góp quỹ giáo dục cho học sinh vùng cao.',
    heroMusicTitle: 'Lắng nghe thanh âm Đại Ngàn',
    heroMusicOn: 'Chạm để dừng phát nhạc',
    heroMusicOff: "Nhấn để phát tiếng T'rưng",
    heroBtnOrder: 'Trải nghiệm Trà Cascara',
    heroBtnLearn: 'Xem hành trình gieo mầm',
    heroScrollDown: 'Tác động xanh',
    esgBadge: 'Dữ Liệu Tuần Hoàn',
    esgTitle: 'Tác Động Xanh',
    esgSubtitle: 'Mỗi ly trà là một vòng tuần hoàn được khép lại.',
    esgCardHuskTitle: 'Vỏ cà phê tái chế',
    esgCardHuskDesc: 'Thu gom từ 12 nông hộ Tây Nguyên',
    esgCardCO2Title: 'CO2 giảm tải',
    esgCardCO2Desc: 'Ngăn chặn khí mê-tan phân hủy hở',
    esgCycleTitle: 'Vòng Lặp Tuần Hoàn CAFLOOP',
    esgCycleZeroWaste: '100% Zero-Waste',
    esgCycleStep1Title: '1. Thu hoạch',
    esgCycleStep1Desc: 'Vỏ quả mọng đỏ',
    esgCycleStep2Title: '2. Phơi nắng',
    esgCycleStep2Desc: 'Trà Cascara thơm',
    esgCycleStep3Title: '3. Học bổng',
    esgCycleStep3Desc: 'Xe đạp & Smart TV',
    impactBadge: 'Tác Động Xã Hội',
    impactTitle: 'Hành Trình Gieo Mầm',
    impactSchool: 'Trường Tiểu học Nguyễn Thị Minh Khai • Tây Nguyên',
    impactImgBadgeTitle: 'Điểm Trường Vùng Cao',
    impactImgBadgeDesc: 'Vượt 8-12km đồi dốc mỗi ngày',
    impactImgBadgeSeason: 'Mùa Tựu Trường',
    impactQuote: '“Toàn bộ lợi nhuận từ phiên bản giới hạn sẽ được chuyển hóa thành phương tiện đến trường và tri thức.”',
    impactFundProgress: 'Tiến Độ Gây Quỹ Hiện Tại',
    impactPhase: 'Giai đoạn 1',
    impactTargetTitle: 'Mục tiêu: 77 xe đạp & 02 Smart TV (Trường TH Nguyễn Thị Minh Khai)',
    impactCompleted: 'Đã hoàn thành',
    impactRemaining: 'Còn 65% để hoàn tất mục tiêu',
    impactBikesTitle: '27 / 77 Xe Đạp',
    impactBikesDesc: 'Đã sẵn sàng bàn giao',
    impactTVsTitle: '01 / 02 Smart TV',
    impactTVsDesc: 'Cho phòng học số',
    impactTransparency: 'Minh bạch 100% tài chính và tiến độ trao quà trực tiếp tại điểm trường',
    storyBadge: 'Hương Vị Đại Ngàn',
    storyTitle: 'Trà Cascara CAFLOOP',
    storySub: 'Mỗi giọt trà ngọt thanh mang theo niềm hy vọng đến trường',
    storyCardBadge: 'Phiên Bản Gây Quỹ Giới Hạn',
    storyCardTitle: 'Hộp Trà Cascara 100g Thượng Hạng',
    storyCardDesc: 'Vị ngọt mận chín, hoa hồng dại & mật ong rừng',
    storyHighlight1Title: 'Giàu Polyphenol: ',
    storyHighlight1Desc: 'Chống oxy hóa cao gấp 8 lần nước ép việt quất tự nhiên.',
    storyHighlight2Title: 'Lượng Caffein Dịu Nhẹ: ',
    storyHighlight2Desc: 'Tỉnh táo tự nhiên, êm dịu dạ dày và giấc ngủ.',
    storyHighlight3Title: '100% Lợi Nhuận Gây Quỹ: ',
    storyHighlight3Desc: 'Mỗi hộp trà tài trợ 1 tuần học tập & bánh mì cho học sinh.',
    storyBtnDonate: 'Ủng Hộ & Nhận Hộp Trà Gây Quỹ (150.000đ)',
    storyBadgeClean: 'Nông Nghiệp Sạch',
    storyBadgeAdditive: 'Không Phụ Gia',
    storyBadgeTransparent: 'Minh Bạch 100%',
    ctaBadge: 'Cùng Chung Đôi Tay',
    ctaTitle: 'Lan Tỏa Tác Động',
    ctaDesc: 'Một lượt chia sẻ của bạn là một bước rút ngắn hành trình đến trường của các em nhỏ.',
    ctaBtnShare: 'Chia sẻ chiến dịch lên Facebook',
    ctaBtnCopy: 'Sao chép liên kết',
    ctaBtnCopied: 'Đã sao chép link!',
    ctaBtnDonate: 'Góp quỹ trực tiếp',
    ctaCounterPrefix: 'Đã có ',
    ctaCounterSuffix: ' lượt chia sẻ vì trẻ em vùng cao',
    modalSuccessTitle: 'Cảm Ơn Tấm Lòng Của Bạn!',
    modalSuccessDesc: 'Thông tin ủng hộ {quantity} Hộp Trà Cascara CAFLOOP đã được ghi nhận. Đội ngũ điều phối dự án sẽ liên hệ bạn sớm để gửi trao hộp trà gây quỹ.',
    modalSuccessDirectImpact: 'Tác Động Trực Tiếp Của Bạn',
    modalSuccessImpactDesc: 'Đóng góp của bạn tương đương hỗ trợ {percent}% chi phí một chiếc xe đạp mới cho học sinh vùng cao.',
    modalSuccessBtnDone: 'Hoàn tất & Quay lại trang',
    modalFundraiseYear: 'Gây Quỹ Giáo Dục 2026',
    modalPreorderTitle: 'Nhận Trà Cascara Gây Quỹ',
    modalPreorderSub: '100% lợi nhuận chuyển đổi thành xe đạp và trang thiết bị học tập.',
    modalItemName: 'Hộp Trà Cascara (100g)',
    modalItemPrice: '150.000đ / hộp',
    modalFieldName: 'Họ và tên của bạn',
    modalFieldNamePlaceholder: 'VD: Nguyễn Văn A',
    modalFieldPhone: 'Số điện thoại nhận hàng',
    modalFieldPhonePlaceholder: 'VD: 0912 345 678',
    modalFieldAddress: 'Địa chỉ nhận trà',
    modalFieldAddressPlaceholder: 'Địa chỉ giao hàng nhận trà gây quỹ',
    modalSummaryLabel: 'Tổng tiền ủng hộ',
    modalFreeship: 'Freeship toàn quốc',
    modalBtnConfirm: 'Xác Nhận Ủng Hộ & Nhận Trà',
    donateModalTitle: 'Quyên Góp Trực Tiếp',
    donateModalSub: 'Góp sức xây dựng tương lai tươi sáng cho các em học sinh vùng cao.',
    donateFieldAmount: 'Số tiền quyên góp',
    donateFieldAmountPlaceholder: 'VD: 500,000',
    donateBtnNext: 'Tiếp Tục Chuyển Khoản',
    donateQRTitle: 'Quét Mã Thanh Toán',
    donateQRSub: 'Mở ứng dụng ngân hàng hoặc ví điện tử (MoMo, VNPay...) để quét mã.',
    donateBtnDone: 'Tôi đã chuyển khoản thành công',
    footerDesc: 'Dự án kinh tế tuần hoàn tái chế vỏ quả cà phê chín mọng thành trà Cascara thượng hạng, gây quỹ học bổng và trang thiết bị cho các điểm trường vùng cao Tây Nguyên.',
    footerPartner: 'Đối tác thụ hưởng: Trường TH Nguyễn Thị Minh Khai',
    footerToTop: 'Lên đầu trang',
    footerCopyright: '© 2026 CAFLOOP - Dự Án Kinh Tế Tuần Hoàn & Quỹ Giáo Dục Vùng Cao',
    footerSlogan: 'Vì một tương lai xanh và ngời sáng tri thức',
    floatingAudioOn: "T'rưng ON",
    floatingAudioOff: "T'rưng",
    floatingSupport: 'Ủng hộ trà'
  },
  en: {
    navCircular: 'Circular',
    navSub: 'From Husk to Hope',
    navAudioOn: 'T\'rưng is playing',
    navAudioOff: 'Highlands sound',
    navAudioToggle: 'Toggle T\'rưng music',
    heroBadge: 'CAFLOOP • FROM HUSK TO HOPE',
    heroTitleLine1: 'From Coffee Husk',
    heroTitleLine2: 'To A Bright Future',
    heroSubtext: 'Enjoy CAFLOOP Cascara Tea - Join hands to fund education for highland students.',
    heroMusicTitle: 'Sound of the Highland Wild',
    heroMusicOn: 'Tap to stop music',
    heroMusicOff: 'Press to play T\'rưng',
    heroBtnOrder: 'Experience Cascara Tea',
    heroBtnLearn: 'View the journey of hope',
    heroScrollDown: 'Green Impact',
    esgBadge: 'Circular Data',
    esgTitle: 'Green Impact',
    esgSubtitle: 'Every cup of tea closes a circular loop.',
    esgCardHuskTitle: 'Recycled Coffee Husk',
    esgCardHuskDesc: 'Collected from 12 highland farming families',
    esgCardCO2Title: 'CO2 Offset',
    esgCardCO2Desc: 'Preventing methane emissions from open decay',
    esgCycleTitle: 'CAFLOOP Circular Loop',
    esgCycleZeroWaste: '100% Zero-Waste',
    esgCycleStep1Title: '1. Harvest',
    esgCycleStep1Desc: 'Red ripe berry husks',
    esgCycleStep2Title: '2. Sun-dry',
    esgCycleStep2Desc: 'Fragrant Cascara tea',
    esgCycleStep3Title: '3. Scholarships',
    esgCycleStep3Desc: 'Bikes & Smart TVs',
    impactBadge: 'Social Impact',
    impactTitle: 'Journey of Hope',
    impactSchool: 'Nguyen Thi Minh Khai Primary School • Central Highlands',
    impactImgBadgeTitle: 'Highland School Site',
    impactImgBadgeDesc: 'Traveling 8-12km hilly roads daily',
    impactImgBadgeSeason: 'Back-to-school',
    impactQuote: '“All profits from this limited edition will be transformed into school transport and digital knowledge.”',
    impactFundProgress: 'Current Fundraising Progress',
    impactPhase: 'Phase 1',
    impactTargetTitle: 'Target: 77 bicycles & 2 Smart TVs (Nguyen Thi Minh Khai Primary School)',
    impactCompleted: 'Completed',
    impactRemaining: '65% remaining to complete target',
    impactBikesTitle: '27 / 77 Bicycles',
    impactBikesDesc: 'Ready for delivery',
    impactTVsTitle: '01 / 02 Smart TV',
    impactTVsDesc: 'For digital classrooms',
    impactTransparency: '100% transparent finance and direct delivery progress at the school site',
    storyBadge: 'Mountain Flavor',
    storyTitle: 'CAFLOOP Cascara Tea',
    storySub: 'Every sweet drop of tea carries hope to school',
    storyCardBadge: 'Limited Fundraising Edition',
    storyCardTitle: 'Premium 100g Cascara Tea Box',
    storyCardDesc: 'Sweet notes of ripe plum, wild rose & forest honey',
    storyHighlight1Title: 'Rich in Polyphenols: ',
    storyHighlight1Desc: '8x higher antioxidant capacity than natural blueberry juice.',
    storyHighlight2Title: 'Mild Caffeine Level: ',
    storyHighlight2Desc: 'Natural alertness, gentle on stomach & sleep.',
    storyHighlight3Title: '100% Fundraising Profits: ',
    storyHighlight3Desc: 'Each tea box sponsors 1 week of schooling & bread for a student.',
    storyBtnDonate: 'Support & Get Fundraising Tea Box (150,000 VND)',
    storyBadgeClean: 'Clean Agriculture',
    storyBadgeAdditive: 'Additive Free',
    storyBadgeTransparent: '100% Transparent',
    ctaBadge: 'Joining Hands',
    ctaTitle: 'Spread the Impact',
    ctaDesc: 'One share of yours is a step closer to school for these children.',
    ctaBtnShare: 'Share campaign on Facebook',
    ctaBtnCopy: 'Copy Campaign Link',
    ctaBtnCopied: 'Link copied!',
    ctaBtnDonate: 'Donate directly',
    ctaCounterPrefix: 'Already ',
    ctaCounterSuffix: ' shares made for highland children',
    modalSuccessTitle: 'Thank You For Your Support!',
    modalSuccessDesc: 'Your support for {quantity} box(es) of CAFLOOP Cascara Tea has been recorded. Our coordination team will contact you soon to deliver your tea box.',
    modalSuccessDirectImpact: 'Your Direct Impact',
    modalSuccessImpactDesc: 'Your contribution supports {percent}% of the cost of a new bicycle for highland students.',
    modalSuccessBtnDone: 'Complete & Back to Page',
    modalFundraiseYear: 'Education Fundraiser 2026',
    modalPreorderTitle: 'Get Fundraising Cascara Tea',
    modalPreorderSub: '100% of profits are converted into bicycles and learning equipment.',
    modalItemName: 'Cascara Tea Box (100g)',
    modalItemPrice: '150,000 VND / box',
    modalFieldName: 'Your Full Name',
    modalFieldNamePlaceholder: 'e.g., John Doe',
    modalFieldPhone: 'Delivery Phone Number',
    modalFieldPhonePlaceholder: 'e.g., 0912 345 678',
    modalFieldAddress: 'Delivery Address',
    modalFieldAddressPlaceholder: 'Address to receive fundraising tea',
    modalSummaryLabel: 'Total Contribution Amount',
    modalFreeship: 'Free shipping nationwide',
    modalBtnConfirm: 'Confirm Pledge & Get Box',
    donateModalTitle: 'Direct Donation',
    donateModalSub: 'Help us build a brighter future for students in the highlands.',
    donateFieldAmount: 'Donation Amount (VND)',
    donateFieldAmountPlaceholder: 'Ex: 500,000',
    donateBtnNext: 'Proceed to Payment',
    donateQRTitle: 'Scan to Pay',
    donateQRSub: 'Open your banking app or e-wallet to scan this QR code.',
    donateBtnDone: 'I have successfully transferred',
    footerDesc: 'A circular economy project upcycling coffee cherry husks into premium Cascara tea, funding scholarships and digital equipment for highland primary schools in the Central Highlands.',
    footerPartner: 'Beneficiary Partner: Nguyen Thi Minh Khai Primary School',
    footerToTop: 'Back to top',
    footerCopyright: '© 2026 CAFLOOP - Circular Economy & Highland Education Fund',
    footerSlogan: 'For a green future and bright minds',
    floatingAudioOn: "T'rưng ON",
    floatingAudioOff: "T'rưng",
    floatingSupport: 'Support tea'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKeys, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cafloop_lang');
      if (saved === 'vi' || saved === 'en') {
        return saved;
      }
      // Detect browser language fallback
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('en')) return 'en';
    }
    return 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cafloop_lang', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const t = (key: TranslationKeys, replacements?: Record<string, string | number>): string => {
    const dict = translations[language] || translations['vi'];
    let text = dict[key] || translations['vi'][key] || '';
    
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
