window.addEventListener("load", (event) => {
  const interval = setInterval(() => {
    const header = document.querySelector("a[title='Go to home']");
    if (header) {
      clearInterval(interval);
      header.insertAdjacentHTML("beforeend", "<div class='header-title'>SIASAR Hub</div>");
    }
  }, 100);
});
