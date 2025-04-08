function previewSelectedImage(event) {
  const input = event.target;
  const preview = document.getElementById("previewImage");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".like-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      const isLiked = icon.getAttribute("data-liked") === "true";
      icon.setAttribute("data-liked", !isLiked);
      icon.classList.toggle("fa-solid", !isLiked);
      icon.classList.toggle("fa-regular", isLiked);
      icon.style.color = !isLiked ? "red" : "";
    });
  });
});
