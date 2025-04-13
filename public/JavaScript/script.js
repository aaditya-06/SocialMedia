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

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
tooltipTriggerList.forEach((tooltipTriggerEl) => {
  new bootstrap.Tooltip(tooltipTriggerEl);
});

// Auto-hide
setTimeout(() => {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    alert.classList.remove("show");
    alert.classList.add("fade");
    setTimeout(() => {
      alert.remove();
    }, 600);
  });
}, 6000);

document.addEventListener("DOMContentLoaded", () => {
  const locationInput = document.getElementById("location");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Optional: use reverse geocoding to get city name
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();

        locationInput.value =
          data.address.city || data.display_name || `${lat}, ${lng}`;
      },
      (error) => {
        console.log("Location access denied or error:", error);
        locationInput.value = "Unknown Location";
      }
    );
  } else {
    console.log("Geolocation not supported");
    locationInput.value = "Unknown Location";
  }
});

const imageInput = document.getElementById("imagePost");
const imagePreview = document.getElementById("imagePreview");

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      imagePreview.setAttribute("src", this.result);
    });
    reader.readAsDataURL(file);
  } else {
    imagePreview.setAttribute(
      "src",
      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
    );
  }
});
