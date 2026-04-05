// Page Navigation and Theme Toggle
(function () {
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            const current = document.querySelector(".active");
            const next = document.getElementById(button.dataset.id);

            current.classList.remove("active");

            setTimeout(() => {
                next.classList.add("active");
            }, 50);
        })
    });
    
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
})();

document.querySelectorAll(".control").forEach(btn => {
    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

// Animate skill bars on scroll into view
(function() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe portfolio items and timeline items
    document.querySelectorAll('.portfolio-item, .timeline-item, .about-item').forEach(el => {
        observer.observe(el);
    });
})();

// Smooth transitions for form inputs
(function() {
    const inputs = document.querySelectorAll('.input-control input, .input-control textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
        });
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
})();

//email logic

// Email sending logic using EmailJS
// Email sending logic using EmailJS
(function () {

    emailjs.init("U6COWwfoZJe_kYDID");

    const submitBtn = document.getElementById("submit-btn");

    submitBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const params = {
            from_name: document.getElementById("name").value,
            from_email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value,
        };

        emailjs.send("service_apnl1br", "template_poykvvi", params)
            .then(() => {
                alert("Message sent successfully!");
                document.getElementById("contact-form").reset();
            })
            .catch(() => {
                alert("Failed to send message. Please try again.");
            });

    });

})();

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.display = "none";
    }
});
