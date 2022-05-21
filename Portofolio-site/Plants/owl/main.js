$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: true,
    autoplay: true,
    autoplayhoverpause: true,
    margin: 160,
    nav: true,
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      890: {
        items: 2,
        nav: false,
      },
      1500: {
        items: 3,
        nav: false,
      },
      2000: {
        items: 4,
        nav: false,
      },
    },
  });
});
