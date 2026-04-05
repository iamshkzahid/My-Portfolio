// Page Navigation and Theme Toggle
(function () {
    // Map section IDs to their nav button data-id
    var sectionIds = ['home', 'about', 'portfolio', 'contact'];

    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            const current = document.querySelector(".active");
            const next = document.getElementById(button.dataset.id);

            if (current === next) return;

            // Update URL hash for persistence (so back button works)
            history.replaceState(null, '', '#' + button.dataset.id);

            // Use GSAP-powered transitions if available (from enhancements.js)
            if (typeof window.switchSection === 'function') {
                window.switchSection(current, next);
            } else {
                current.classList.remove("active");
                next.classList.add("active");
            }
        })
    });

    // On page load: restore section from URL hash
    function restoreFromHash() {
        var hash = window.location.hash.replace('#', '');
        if (hash && sectionIds.indexOf(hash) !== -1 && hash !== 'home') {
            var current = document.querySelector('.active');
            var next = document.getElementById(hash);
            if (current && next && current !== next) {
                // Switch without animation (instant restore)
                current.classList.remove('active');
                next.classList.add('active');

                // Update nav button highlight
                document.querySelector('.active-btn').classList.remove('active-btn');
                var targetBtn = document.querySelector('.control[data-id="' + hash + '"]');
                if (targetBtn) targetBtn.classList.add('active-btn');
            }
        }
    }
    // Restore after DOM is ready but before animations
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

document.querySelectorAll(".control").forEach(btn => {
    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});



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
                if (typeof window.showToast === 'function') {
                    window.showToast('Message sent successfully!', 'success');
                } else {
                    alert("Message sent successfully!");
                }
                document.getElementById("contact-form").reset();
            })
            .catch(() => {
                if (typeof window.showToast === 'function') {
                    window.showToast('Failed to send message. Please try again.', 'error');
                } else {
                    alert("Failed to send message. Please try again.");
                }
            });

    });

})();
