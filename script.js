document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    
    const sectionUpload = document.getElementById('upload-section');
    const sectionProcessing = document.getElementById('processing-section');
    const sectionResults = document.getElementById('results-section');
    
    // Processing Elements
    const progressBar = document.getElementById('progress-bar');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');
    const step5 = document.getElementById('step-5');
    const processingTitle = document.getElementById('processing-title');
    const processingSubtitle = document.getElementById('processing-subtitle');
    
    // Results Elements
    const uploadedImage = document.getElementById('uploaded-image');
    const btnReset = document.getElementById('btn-reset');
    
    // Mock Data (In a real app, this comes from the backend API)
    const mockPredictionData = {
        plateNumber: "MH-12-PQ-9876",
        manufacturer: "Hyundai",
        model: "Creta",
        year: "2021",
        variant: "SX Opt Diesel AT",
        fuel: "Diesel",
        transmission: "Automatic",
        body: "SUV",
        color: "Phantom Black",
        ownership: "1st Owner",
        kmDriven: "34,500 km",
        condition: "Excellent",
        damage: "No major damage detected. Minor scratch on rear left door.",
        predictedPrice: "16,45,000"
    };

    // --- File Upload Handling ---
    
    // Click to upload
    dropZone.addEventListener('click', (e) => {
        if(e.target.tagName !== 'BUTTON') {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Drag and Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if(e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    function handleFile(file) {
        if(!file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        // Preview image in result section
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Start workflow
        startProcessing();
    }

    // --- Processing Workflow Simulation ---
    function startProcessing() {
        // Switch view
        sectionUpload.classList.add('hidden');
        sectionUpload.classList.remove('active');
        sectionProcessing.classList.remove('hidden');
        
        // Step Sequence using Timers
        setTimeout(() => updateStep(step1, 20, "Enhancing Image", "Adjusting contrast and removing glare"), 500);
        setTimeout(() => updateStep(step2, 40, "Extracting Text", "Running Tesseract OCR on number plate"), 2000);
        setTimeout(() => updateStep(step3, 60, "Visual Assessment", "Detecting scratches, dents, and body condition"), 4000);
        setTimeout(() => updateStep(step4, 80, "Querying Database", "Fetching RTO specs via plate number"), 6000);
        setTimeout(() => updateStep(step5, 100, "Price Prediction", "Applying ML model to determine market value"), 8000);
        
        setTimeout(showResults, 10000);
    }

    function updateStep(stepElement, progressPct, title, subtitle) {
        // Update previous steps to completed
        const allSteps = document.querySelectorAll('.step');
        let foundCurrent = false;
        allSteps.forEach(st => {
            if(st === stepElement) {
                foundCurrent = true;
                st.classList.remove('pending');
                st.classList.add('active');
                st.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin text-accent"></i> ${st.innerText}`;
            } else if (!foundCurrent) {
                st.classList.remove('active', 'pending');
                st.classList.add('completed');
                st.innerHTML = `<i class="fa-solid fa-check text-green"></i> ${st.innerText}`;
            }
        });

        progressBar.style.width = `${progressPct}%`;
        processingTitle.innerText = title;
        processingSubtitle.innerText = subtitle;
    }

    // --- Show Results ---
    function showResults() {
        sectionProcessing.classList.add('hidden');
        sectionResults.classList.remove('hidden');
        
        // Populate Data
        document.getElementById('res-plate').innerText = mockPredictionData.plateNumber;
        
        // Animate Price Number
        animateValue("res-price", 0, parseInt(mockPredictionData.predictedPrice.replace(/,/g, '')), 1500);
        
        // Populate Specs
        document.getElementById('res-manufacturer').innerText = mockPredictionData.manufacturer;
        document.getElementById('res-model').innerText = mockPredictionData.model;
        document.getElementById('res-year').innerText = mockPredictionData.year;
        document.getElementById('res-variant').innerText = mockPredictionData.variant;
        document.getElementById('res-fuel').innerText = mockPredictionData.fuel;
        document.getElementById('res-transmission').innerText = mockPredictionData.transmission;
        document.getElementById('res-body').innerText = mockPredictionData.body;
        document.getElementById('res-color').innerText = mockPredictionData.color;
        document.getElementById('res-ownership').innerText = mockPredictionData.ownership;
        document.getElementById('res-km').innerText = mockPredictionData.kmDriven;
        
        document.getElementById('res-condition').innerText = mockPredictionData.condition;
        document.getElementById('res-damage').innerText = mockPredictionData.damage;
    }

    // Number animation utility
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Format to Indian Number System
            const currentVal = Math.floor(progress * (end - start) + start);
            obj.innerHTML = currentVal.toLocaleString('en-IN');
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toLocaleString('en-IN');
            }
        };
        window.requestAnimationFrame(step);
    }
});
