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
  | 'esgCardByProductTitle'
  | 'esgCardByProductDesc'
  | 'esgCardLaborTitle'
  | 'esgCardLaborDesc'
  | 'esgCardQRTitle'
  | 'esgCardQRDesc'
  | 'esgCardHouseholdsTitle'
  | 'esgCardHouseholdsDesc'
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
  | 'impactCompletionTitle'
  | 'impactCompletionValue'
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
  | 'storyBtnDonate'
  | 'storyProd2Badge'
  | 'storyProd2Title'
  | 'storyProd2Desc'
  | 'storyProd2Highlight1Title'
  | 'storyProd2Highlight1Desc'
  | 'storyProd2Highlight2Title'
  | 'storyProd2Highlight2Desc'
  | 'storyProd2Highlight3Title'
  | 'storyProd2Highlight3Desc'
  | 'storyProd2BtnDonate'
  | 'storyProd3Badge'
  | 'storyProd3Title'
  | 'storyProd3Desc'
  | 'storyProd3Highlight1Title'
  | 'storyProd3Highlight1Desc'
  | 'storyProd3Highlight2Title'
  | 'storyProd3Highlight2Desc'
  | 'storyProd3Highlight3Title'
  | 'storyProd3Highlight3Desc'
  | 'storyProd3BtnDonate'
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
  | 'donateBtnDone'
  | 'brandStoryBadge'
  | 'brandStoryTitle'
  | 'brandStorySubtitle'
  | 'visionTitle'
  | 'visionDesc'
  | 'missionTitle'
  | 'missionDesc'
  | 'coreValuesTitle'
  | 'coreValuesSub'
  | 'valUpcyclingTitle'
  | 'valUpcyclingDesc'
  | 'valGenuineTitle'
  | 'valGenuineDesc'
  | 'valCultureTitle'
  | 'valCultureDesc'
  | 'valEcosystemTitle'
  | 'valEcosystemDesc'
  | 'valStartSmallTitle'
  | 'valStartSmallDesc'
  | 'founderBadge'
  | 'founderName'
  | 'founderRole'
  | 'founderQuote'
  | 'founderStep1Title'
  | 'founderStep1Desc'
  | 'founderStep2Title'
  | 'founderStep2Desc'
  | 'founderStep3Title'
  | 'founderStep3Desc'
  | 'founderReadMoreBtn'
  | 'founderModalTitle'
  | 'founderModalClose';

const translations: Record<Language, Record<TranslationKeys, string>> = {
  vi: {
    navCircular: 'Tuần Hoàn',
    navSub: 'From Husk to Hope',
    navAudioOn: "T'rưng đang vang",
    navAudioOff: 'Âm thanh Tây Nguyên',
    navAudioToggle: "Bật/Tắt âm thanh Đàn T'rưng",
    heroBadge: 'CAFLOOP • FROM HUSK TO HOPE',
    heroTitleLine1: 'Từ Vỏ Cà Phê Đến',
    heroTitleLine2: 'Tương Lai Ngời\u00A0Sáng',
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
    esgCardByProductTitle: 'Khối lượng phụ phẩm tái sử dụng',
    esgCardByProductDesc: 'Thu gom và tái chế vỏ cà phê chín mọng thành trà & túi thơm.',
    esgCardLaborTitle: 'Giờ công lao động cộng đồng',
    esgCardLaborDesc: 'Ước tính TB 2 giờ dệt & hoàn thiện/túi thổ cẩm thủ công.',
    esgCardQRTitle: 'Lượt quét mã QR truy cập web',
    esgCardQRDesc: 'Lượt quan tâm và đồng hành cùng chiến dịch kinh tế tuần hoàn.',
    esgCardHouseholdsTitle: 'Hộ dân hỗ trợ trực tiếp',
    esgCardHouseholdsDesc: 'Nông hộ và các nghệ nhân Ê Đê đồng hành tạo sinh kế.',
    esgCycleTitle: 'Vòng Lặp Tuần Hoàn CAFLOOP',
    esgCycleZeroWaste: '100% Zero-Waste',
    esgCycleStep1Title: '1. Thu hoạch',
    esgCycleStep1Desc: 'Vỏ quả mọng đỏ',
    esgCycleStep2Title: '2. Phơi nắng',
    esgCycleStep2Desc: 'Trà Cascara thơm',
    esgCycleStep3Title: '3. Gây quỹ',
    esgCycleStep3Desc: 'Xe đạp & TV',
    impactBadge: 'Tác Động Xã Hội',
    impactTitle: 'Hành Trình Gieo Mầm',
    impactSchool: 'Trường Tiểu học Nguyễn Thị Minh Khai • Tây Nguyên',
    impactImgBadgeTitle: 'Điểm Trường Vùng Cao',
    impactImgBadgeDesc: 'Vượt 8-12km đồi dốc mỗi ngày',
    impactImgBadgeSeason: 'Mùa Tựu Trường',
    impactQuote: '“Toàn bộ lợi nhuận từ phiên bản giới hạn sẽ được chuyển hóa thành phương tiện đến trường và tri thức.”',
    impactFundProgress: 'Tiến Độ Gây Quỹ Hiện Tại',
    impactPhase: 'Giai đoạn 1',
    impactTargetTitle: 'Mục tiêu: 77 xe đạp & 02 TV (Trường TH Nguyễn Thị Minh Khai)',
    impactCompleted: 'Đã hoàn thành',
    impactRemaining: 'Đạt 100% mục tiêu giai đoạn 1',
    impactBikesTitle: '77 / 77 Xe Đạp',
    impactBikesDesc: 'Đã sẵn sàng bàn giao',
    impactTVsTitle: '02 / 02 TV',
    impactTVsDesc: 'Cho phòng học số',
    impactCompletionTitle: 'Thời gian hoàn thành:',
    impactCompletionValue: '30/04/2026 (Hoàn tất 100% trước hạn)',
    impactTransparency: 'Minh bạch 100% tài chính và tiến độ trao quà trực tiếp tại điểm trường',
    storyBadge: 'Hương Vị Đại Ngàn',
    storyTitle: 'Trà Cascara CAFLOOP',
    storySub: 'Mỗi giọt trà ngọt thanh mang theo niềm hy vọng đến trường',
    storyCardBadge: 'Phiên Bản Gây Quỹ Giới Hạn',
    storyCardTitle: 'Túi Trà Cascara 100g Thượng Hạng',
    storyCardDesc: 'Vị ngọt mận chín, hoa hồng dại & mật ong rừng',
    storyHighlight1Title: 'Giàu Polyphenol: ',
    storyHighlight1Desc: 'Chống oxy hóa cao gấp 8 lần nước ép việt quất tự nhiên.',
    storyHighlight2Title: 'Lượng Caffein Dịu Nhẹ: ',
    storyHighlight2Desc: 'Tỉnh táo tự nhiên, êm dịu dạ dày và giấc ngủ.',
    storyHighlight3Title: '100% Lợi Nhuận Gây Quỹ: ',
    storyHighlight3Desc: 'Mỗi hộp trà tài trợ 1 tuần học tập & bánh mì cho học sinh.',
    storyBtnDonate: 'Ủng Hộ & Nhận Hộp Trà',
    storyProd2Badge: 'SẢN PHẨM MỚI',
    storyProd2Title: 'Túi Thơm Thảo Mộc',
    storyProd2Desc: 'Mang hương thơm đại ngàn vào không gian của bạn',
    storyProd2Highlight1Title: 'Thư giãn: ',
    storyProd2Highlight1Desc: 'Hương thơm dịu nhẹ giúp giảm căng thẳng và mệt mỏi.',
    storyProd2Highlight2Title: 'Khử mùi: ',
    storyProd2Highlight2Desc: 'Hiệu quả không gian nhỏ như xe hơi, tủ quần áo.',
    storyProd2Highlight3Title: '100% tự nhiên: ',
    storyProd2Highlight3Desc: 'An toàn cho sức khỏe, không chứa hóa chất.',
    storyProd2BtnDonate: 'Ủng Hộ & Nhận Túi Thơm',
    storyProd3Badge: 'BẢN SẮC VÙNG CAO',
    storyProd3Title: 'Túi Thổ Cẩm Bản Địa',
    storyProd3Desc: 'Tôn vinh nét đẹp văn hóa truyền thống Tây Nguyên',
    storyProd3Highlight1Title: 'Thủ công: ',
    storyProd3Highlight1Desc: 'Dệt tay tỉ mỉ bởi các nghệ nhân địa phương.',
    storyProd3Highlight2Title: 'Độc bản: ',
    storyProd3Highlight2Desc: 'Mỗi chiếc túi mang một hoa văn duy nhất không đụng hàng.',
    storyProd3Highlight3Title: 'Bền vững: ',
    storyProd3Highlight3Desc: 'Góp phần tạo sinh kế ổn định cho phụ nữ vùng cao.',
    storyProd3BtnDonate: 'Ủng Hộ & Nhận Túi Thổ Cẩm',
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
    modalItemName: 'Túi Trà Cascara (100g)',
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
    floatingSupport: 'Ủng hộ trà',
    brandStoryBadge: 'Câu Chuyện Thương Hiệu',
    brandStoryTitle: 'Hành Trình Tái Sinh & Hy Vọng',
    brandStorySubtitle: 'Từ trăn trở nơi đại ngàn Tây Nguyên đến vòng tuần hoàn xanh bền vững',
    visionTitle: 'Tầm Nhìn',
    visionDesc: 'Xây dựng mô hình kinh tế tuần hoàn tại Tây Nguyên - nơi phụ phẩm nông nghiệp được tái sinh, văn hóa bản địa được tôn vinh, và đổi mới bền vững bắt nguồn từ chính cộng đồng.',
    missionTitle: 'Sứ Mệnh',
    missionDesc: 'Biến vỏ cà phê bỏ đi thành các sản phẩm tuần hoàn giá trị cao; kết nối nông dân, nghệ nhân Ê Đê và thế hệ trẻ để giảm lãng phí, bảo tồn di sản và lan tỏa lối sống xanh.',
    coreValuesTitle: '5 Giá Trị Cốt Lõi',
    coreValuesSub: 'Kim chỉ nam dẫn dắt mọi hành động và sản phẩm của Cafloop',
    valUpcyclingTitle: 'Tái Sinh',
    valUpcyclingDesc: 'Khơi mở tài nguyên giá trị từ nguồn phụ phẩm bị lãng quên.',
    valGenuineTitle: 'Bền Vững Thực Chất',
    valGenuineDesc: 'Tác động thật đo lường được cho môi trường & đời sống nông dân.',
    valCultureTitle: 'Tôn Trọng Văn Hóa',
    valCultureDesc: 'Gìn giữ tri thức bản địa cùng nét đẹp dệt may thổ cẩm Ê Đê.',
    valEcosystemTitle: 'Kết Nối Cộng Đồng',
    valEcosystemDesc: 'Nhịp cầu giữa nông dân vùng trồng, nghệ nhân và người tiêu dùng trẻ.',
    valStartSmallTitle: 'Bắt Đầu Từ Điều Nhỏ',
    valStartSmallDesc: 'Thay đổi lớn lao khởi đầu từ một vỏ cà phê nhỏ bé tại quê hương.',
    founderBadge: 'Người Sáng Lập',
    founderName: 'Phan Hoàng Quỳnh Chi',
    founderRole: 'Founder Dự án CAFLOOP',
    founderQuote: '“CAFLOOP không chỉ là một dự án khởi nghiệp, mà là câu trả lời thực tế cho trăn trở: Làm sao để giá trị chuỗi sản xuất thực sự ở lại với người nông dân và mảnh đất Tây Nguyên.”',
    founderStep1Title: 'Trăn trở từ quê hương',
    founderStep1Desc: 'Lớn lên giữa thủ phủ cà phê, chứng kiến hàng ngàn tấn vỏ quả bị đốt bỏ mỗi vụ mùa và khoảng cách phân bổ giá trị nông nghiệp.',
    founderStep2Title: 'Nền tảng nghiên cứu',
    founderStep2Desc: 'Nghiên cứu kinh tế về tín chỉ tuần hoàn (C4F), truy xuất QR-code và định hướng nghề nghiệp phát triển bền vững tại Đắk Lắk.',
    founderStep3Title: 'Hành động thực tiễn',
    founderStep3Desc: 'Sáng lập CAFLOOP - biến trăn trở thành giải pháp kinh tế tuần hoàn tái sinh phụ phẩm, tạo sinh kế bền vững.',
    founderReadMoreBtn: 'Đọc câu chuyện đầy đủ của Quỳnh Chi',
    founderModalTitle: 'Câu Chuyện & Hành Trình: Phan Hoàng Quỳnh Chi',
    founderModalClose: 'Đóng'
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
    esgCardByProductTitle: 'Upcycled By-products Weight',
    esgCardByProductDesc: 'Coffee cherry husks upcycled into premium tea & scent sachets.',
    esgCardLaborTitle: 'Community Labor Hours',
    esgCardLaborDesc: 'Estimated avg 2 hours of weaving & finishing per handmade brocade bag.',
    esgCardQRTitle: 'QR Scans & Web Visits',
    esgCardQRDesc: 'Visitors exploring and engaging with our circular economy mission.',
    esgCardHouseholdsTitle: 'Households Supported',
    esgCardHouseholdsDesc: 'Local farmers and Ê Đê weaving artisans supported with sustainable income.',
    esgCycleTitle: 'CAFLOOP Circular Loop',
    esgCycleZeroWaste: '100% Zero-Waste',
    esgCycleStep1Title: '1. Harvest',
    esgCycleStep1Desc: 'Red ripe berry husks',
    esgCycleStep2Title: '2. Sun-dry',
    esgCycleStep2Desc: 'Fragrant Cascara tea',
    esgCycleStep3Title: '3. Fundraising',
    esgCycleStep3Desc: 'Bikes & TVs',
    impactBadge: 'Social Impact',
    impactTitle: 'Journey of Hope',
    impactSchool: 'Nguyen Thi Minh Khai Primary School • Central Highlands',
    impactImgBadgeTitle: 'Highland School Site',
    impactImgBadgeDesc: 'Traveling 8-12km hilly roads daily',
    impactImgBadgeSeason: 'Back-to-school',
    impactQuote: '“All profits from this limited edition will be transformed into school transport and digital knowledge.”',
    impactFundProgress: 'Current Fundraising Progress',
    impactPhase: 'Phase 1',
    impactTargetTitle: 'Target: 77 bicycles & 2 TVs (Nguyen Thi Minh Khai Primary School)',
    impactCompleted: 'Completed',
    impactRemaining: '100% goal achieved for Phase 1',
    impactBikesTitle: '77 / 77 Bicycles',
    impactBikesDesc: 'Ready for delivery',
    impactTVsTitle: '02 / 02 TVs',
    impactTVsDesc: 'For digital classrooms',
    impactCompletionTitle: 'Completion Timeline:',
    impactCompletionValue: 'Apr 30, 2026 (100% achieved ahead of schedule)',
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
    storyBtnDonate: 'Support & Get Tea Box',
    storyProd2Badge: 'NEW PRODUCT',
    storyProd2Title: 'Aroma Herbal Sachet',
    storyProd2Desc: 'Bring the pure aroma of the highland forest into your living space',
    storyProd2Highlight1Title: 'Relaxation: ',
    storyProd2Highlight1Desc: 'Gentle natural aroma eases stress, soothing the mind and body.',
    storyProd2Highlight2Title: 'Odor Eliminator: ',
    storyProd2Highlight2Desc: 'Highly effective for compact spaces such as cars, wardrobes & desks.',
    storyProd2Highlight3Title: '100% Natural: ',
    storyProd2Highlight3Desc: 'Safe for daily health, free from artificial chemicals & fragrances.',
    storyProd2BtnDonate: 'Support & Get Sachet',
    storyProd3Badge: 'HIGHLAND HERITAGE',
    storyProd3Title: 'Indigenous Brocade Bag',
    storyProd3Desc: 'Honoring the traditional cultural craftsmanship of the Central Highlands',
    storyProd3Highlight1Title: 'Handmade: ',
    storyProd3Highlight1Desc: 'Meticulously handwoven by local ethnic artisans.',
    storyProd3Highlight2Title: 'Unique Pattern: ',
    storyProd3Highlight2Desc: 'Every piece carries an authentic, one-of-a-kind pattern.',
    storyProd3Highlight3Title: 'Sustainable: ',
    storyProd3Highlight3Desc: 'Provides steady sustainable livelihoods for highland women.',
    storyProd3BtnDonate: 'Support & Get Brocade Bag',
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
    floatingSupport: 'Support tea',
    brandStoryBadge: 'Brand Story',
    brandStoryTitle: 'A Journey of Regeneration & Hope',
    brandStorySubtitle: 'From highland reflections to a sustainable circular economy loop',
    visionTitle: 'Our Vision',
    visionDesc: 'To pioneer a circular economy model in the Central Highlands — where agricultural by-products are regenerated, indigenous culture is honored, and sustainable innovations originate from local communities.',
    missionTitle: 'Our Mission',
    missionDesc: 'To transform discarded coffee husks into high-value circular products; connecting farmers, Ê Đê artisans, and the youth to eliminate agricultural waste, preserve heritage, and inspire sustainable living.',
    coreValuesTitle: '5 Core Values',
    coreValuesSub: 'The guiding compass for all actions and products at Cafloop',
    valUpcyclingTitle: 'Upcycling',
    valUpcyclingDesc: 'Discovering valuable new resources in what others discard.',
    valGenuineTitle: 'Genuine Sustainability',
    valGenuineDesc: 'Real, measurable positive impact on the land and local livelihoods.',
    valCultureTitle: 'Cultural Reverence',
    valCultureDesc: 'Preserving indigenous wisdom and Ê Đê traditional weaving art.',
    valEcosystemTitle: 'Community Connection',
    valEcosystemDesc: 'A meaningful bridge connecting farmers, artisans, and conscious youth.',
    valStartSmallTitle: 'Starting Small',
    valStartSmallDesc: 'Great systemic transformations begin with a humble coffee husk.',
    founderBadge: 'Founder Profile',
    founderName: 'Phan Hoang Quynh Chi',
    founderRole: 'Founder of CAFLOOP Project',
    founderQuote: '“CAFLOOP is not merely a startup, but a practical answer to an enduring question: How can the true value of the supply chain remain with local farmers and our highland soil.”',
    founderStep1Title: 'Highland Roots',
    founderStep1Desc: 'Raised in the coffee heartland, troubled by thousands of tons of husks burned each harvest and unfair value distribution.',
    founderStep2Title: 'Academic Research',
    founderStep2Desc: 'Researched carbon market asymmetries (C4F), QR traceability, and sustainability-driven career orientation in Dak Lak.',
    founderStep3Title: 'Real-world Action',
    founderStep3Desc: 'Founded CAFLOOP to translate academic research into a viable circular model that uplifts highland communities.',
    founderReadMoreBtn: 'Read Quynh Chi’s Full Story',
    founderModalTitle: 'Founder Journey: Phan Hoang Quynh Chi',
    founderModalClose: 'Close'
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
