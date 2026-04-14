// Page Navigation and Theme Toggle
(function () {
    // Map section IDs to their nav button data-id
    var sectionIds = ['home', 'about', 'portfolio', 'contact'];

    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            var currActiveBtn = document.querySelector(".active-btn");
            if (currActiveBtn) {
                currActiveBtn.classList.remove("active-btn");
                currActiveBtn.removeAttribute("aria-current");
            }
            this.classList.add("active-btn");
            this.setAttribute("aria-current", "page");
            const current = document.querySelector(".active");
            const next = document.getElementById(button.dataset.id);

            if (current === next) return;

           
            history.replaceState(null, '', '#' + button.dataset.id);

            window.scrollTo({ top: 0, behavior: "smooth" });

            if (typeof window.switchSection === 'function') {
                window.switchSection(current, next);
            } else {
                current.classList.remove("active");
                next.classList.add("active");
            }
        })
    });

    function restoreFromHash() {
        var hash = window.location.hash.replace('#', '');
        if (hash && sectionIds.indexOf(hash) !== -1 && hash !== 'home') {
            var current = document.querySelector('.active');
            var next = document.getElementById(hash);
            if (current && next && current !== next) {
                current.classList.remove('active');
                next.classList.add('active');

                var currBtn = document.querySelector('.active-btn');
                if (currBtn) {
                    currBtn.classList.remove('active-btn');
                    currBtn.removeAttribute('aria-current');
                }
                var targetBtn = document.querySelector('.control[data-id="' + hash + '"]');
                if (targetBtn) {
                    targetBtn.classList.add('active-btn');
                    targetBtn.setAttribute('aria-current', 'page');
                }
            }
        }
    }
    restoreFromHash();

    // Open all external links in new tabs
    document.querySelectorAll('a[href^="http"]').forEach(function(link) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
    
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
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

// Email sending logic using EmailJS
(function () {

    emailjs.init("U6COWwfoZJe_kYDID");

    const submitBtn = document.getElementById("submit-btn");
    var isSubmitting = false;

    submitBtn.addEventListener("click", function (e) {
        e.preventDefault();

        // Prevent double-submit / spam
        if (isSubmitting) return;

        var name = document.getElementById("name").value.trim();
        var email = document.getElementById("email").value.trim();
        var subject = document.getElementById("subject").value.trim();
        var message = document.getElementById("message").value.trim();

        // Validate all fields are filled
        if (!name || !email || !subject || !message) {
            if (typeof window.showToast === 'function') {
                window.showToast('Please fill in all fields before submitting.', 'error');
            } else {
                alert('Please fill in all fields before submitting.');
            }
            return;
        }

        // Basic email format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (typeof window.showToast === 'function') {
                window.showToast('Please enter a valid email address.', 'error');
            } else {
                alert('Please enter a valid email address.');
            }
            return;
        }

        isSubmitting = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.pointerEvents = 'none';

        const params = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
        };

        emailjs.send("service_apnl1br", "template_poykvvi", params)
            .then(() => {
                if (typeof window.showToast === 'function') {
                    window.showToast('Message sent successfully!', 'success');
                } else {
                    alert("Message sent successfully!");
                }
                document.getElementById("contact-form").reset();
                // Cooldown: re-enable after 10 seconds to prevent spam
                setTimeout(function() {
                    isSubmitting = false;
                    submitBtn.style.opacity = '';
                    submitBtn.style.pointerEvents = '';
                }, 10000);
            })
            .catch(() => {
                if (typeof window.showToast === 'function') {
                    window.showToast('Failed to send message. Please try again.', 'error');
                } else {
                    alert("Failed to send message. Please try again.");
                }
                isSubmitting = false;
                submitBtn.style.opacity = '';
                submitBtn.style.pointerEvents = '';
            });

    });

})();
