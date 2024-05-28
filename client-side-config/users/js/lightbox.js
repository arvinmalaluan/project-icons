document.addEventListener('DOMContentLoaded', function () {
    /**
     * Initiate gallery lightbox 
     */
    const logogalLightbox = GLightbox({
      selector: '.logogal-lightbox'
    });
  
    /**
     * Initiate Swiper
     */
    const logogalSwiper = new Swiper('.logogal-slider', {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  });
  