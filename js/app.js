/**DETAIL DIVISION
 * 1 = UI/UX Designer
 * 2 = Web Development
 * 3 = Competitive Programming
 * 4 = Mobile Development
 * 5 = Machine Learning
 * 6 = Project Manager
 */

const divisionNames = {
    "1": { name: "UI/UX Designer", color: "text-bg-info" },
    "2": { name: "Web Development", color: "text-bg-success" },
    "3": { name: "Competitive Programming", color: "text-bg-secondary" },
    "4": { name: "Mobile Development", color: "text-bg-primary" },
    "5": { name: "Machine Learning", color: "text-bg-warning" },
    "6": { name: "Project Manager", color: "text-bg-purple" } 
};

/**
 * DUMMY DATA PROJECT
 */
const defaultProjects = [
    {
        id: 1,
        title: "ITC Showcase Website",
        desc: "Platform manajemen portofolio digital untuk seluruh divisi ITC.",
        creator: "Rifani Juniarti",
        division: "2", 
        url: "github.com/itc/showcase",
        image: "./assets/img/web-image.avif"
    },
    {
        id: 2,
        title: "Smart Trash App",
        desc: "Aplikasi mobile IoT untuk memonitor kapasitas tempat sampah.",
        creator: "Budi Santoso",
        division: "4", 
        url: "github.com/budi/smart-trash",
        image: "./assets/img/mobile-image.jpg"
    },
    {
        id: 3,
        title: "ITC Portal",
        desc: "UI/UX website pendaftaran anggota ITC.",
        creator: "Siti Aminah",
        division: "1", 
        url: "figma.com/itc-portal",
        image: "./assets/img/web-image.avif"
    },
    {
        id: 4,
        title: "ITC Assistant",
        desc: "Chatbot pintar berbasis AI untuk menjawab segala pertanyaan seputar informasi ITC.",
        creator: "Andi Saputra",
        division: "5", 
        url: "github.com/andi/itc-assistant",
        image: "./assets/img/ml-image.jpg"
    },
    {
        id: 5,
        title: "Algoritma Pathfinding",
        desc: "Implementasi algoritma A* untuk robot line follower.",
        creator: "Dewi Lestari",
        division: "3", 
        url: "github.com/dewi/pathfinding",
        image: "./assets/img/no-image.jpg"
    },
    {
        id: 6,
        title: "ITC Bootcamp Plan",
        desc: "Rancangan jadwal dan modul untuk bootcamp tahunan ITC.",
        creator: "Fajar Nugraha",
        division: "6",
        url: "notion.so/itc/bootcamp",
        image: "./assets/img/no-image.jpg"
    }
];

// setup local storage
let projects = JSON.parse(localStorage.getItem('itc_projects')) || defaultProjects;

const saveToLocalStorage = () => {
    localStorage.setItem('itc_projects', JSON.stringify(projects));
};

/**
 * DAFTAR PROJECT
 */
const renderProjects = () => {
    const gridContainer = document.querySelector('.main-content'); 
    gridContainer.innerHTML = ''; 

    projects.forEach(project => {
        const divInfo = divisionNames[project.division] || { name: "Unknown", color: "text-bg-dark" };

        const cardHTML = `
            <div class="col">
                <div class="card h-100 shadow-sm" style="cursor: pointer;" onclick="openDetailModal(${project.id})">
                    <img src="${project.image}" class="card-img-top card-img-ratio" alt="Thumbnail">
                    <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <span class="badge rounded-pill ${divInfo.color} mb-2">${divInfo.name}</span> 
                        <p class="card-text">${project.desc.substring(0, 80)}...</p> 
                    </div>
                    <div class="card-footer bg-white border-top-1 mb-1"> 
                        <div class="d-flex align-items-center"> 
                            <img src="./assets/img/avatar.png" alt="User Avatar" class="avatar-circle me-3"> 
                            <div class="d-flex flex-column"> 
                                <span class="fw-bold text-dark">${project.creator}</span>                         
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        gridContainer.innerHTML += cardHTML;
    });
};

// konversi save image
const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

/**
 * INPUT
 */
const formInput = document.getElementById('input-project');
const fileInput = document.getElementById('inputImage');

if (formInput) {
    formInput.addEventListener('submit', async function (event) { 
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;
        let imageBase64 = "./assets/img/no-image.jpg"; 

        // validasi upload
        if (fileInput.files.length > 0) {
            const fileSizeKB = fileInput.files[0].size / 1024;
            if (fileSizeKB > 500) {
                fileInput.setCustomValidity('Ukuran file maksimal 500KB.');
                isValid = false;
            } else {
                fileInput.setCustomValidity('');
                imageBase64 = await getBase64(fileInput.files[0]);
            }
        }

        if (!formInput.checkValidity()) isValid = false;
        formInput.classList.add('was-validated');

        if (!isValid) {
            Swal.fire({ icon: 'error', title: 'Form Belum Lengkap!', text: 'Periksa kembali form Anda.' });
            return;
        }

        const newProject = {
            id: Date.now(),
            title: document.getElementById('inputNameProject').value,
            desc: document.getElementById('inputDetailProject').value,
            creator: document.getElementById('inputCreator').value,
            division: document.getElementById('inputSelectDivision').value,
            url: document.getElementById('inputUrlProject').value,
            image: imageBase64
        };

        projects.push(newProject); 
        saveToLocalStorage(); 

        Swal.fire({ 
            title: 'Menyimpan Data...', 
            allowOutsideClick: false, 
            didOpen: () => { 
                Swal.showLoading(); 
            } });

        setTimeout(() => {
            Swal.fire({ 
                icon: 'success', 
                title: 'Berhasil!', 
                text: 'Project baru ditambahkan.', 
                showConfirmButton: false, 
                timer: 1500 
            }).then(() => {
                formInput.reset();
                formInput.classList.remove('was-validated');
                bootstrap.Modal.getInstance(document.getElementById('modalInput')).hide();
                renderProjects(); // Refresh layar biar card baru muncul!
            });
        }, 1000);
    });
}

/**
 * MODAL
 */
window.openDetailModal = function(id) {
    // cari project berdasarkan ID
    const selectedProject = projects.find(p => p.id === id);
    if(!selectedProject) return;

    const divInfo = divisionNames[selectedProject.division] || { name: "Unknown", color: "text-bg-dark" };

    // detail
    document.getElementById('detailImage').src = selectedProject.image;
    document.getElementById('detailNameProject').innerText = selectedProject.title;
    document.getElementById('detailProject').innerText = selectedProject.desc;
    document.getElementById('detailCreator').innerText = selectedProject.creator;
    document.getElementById('detailDivision').innerText = divInfo.name;
    document.getElementById('detailDivision').className = `badge ${divInfo.color} mb-2`; 
    document.getElementById('detailUrlProject').innerText = selectedProject.url;
    document.getElementById('detailUrlProject').urlElement.onclick = function() {
        window.open("https://" + selectedProject.url, '_blank');
    };

    // edit
    document.getElementById('editNameProject').value = selectedProject.title;
    document.getElementById('editDetailProject').value = selectedProject.desc;
    document.getElementById('editCreator').value = selectedProject.creator;
    document.getElementById('editSelectDivision').value = selectedProject.division;
    document.getElementById('editUrlProject').value = selectedProject.url;
    
    document.getElementById('btnDeleteProject').setAttribute('data-id', selectedProject.id);
    
    const detailModal = new bootstrap.Modal(document.getElementById('modalDetail1'));
    detailModal.show();
};

/**
 * EDIT
 */
window.toggleEditMode = function (isEditMode) {
    const viewSection = document.getElementById('modalView');
    const editSection = document.getElementById('modalEdit');

    if (isEditMode) {
        viewSection.classList.add('d-none');
        editSection.classList.remove('d-none');
    } else {
        viewSection.classList.remove('d-none');
        editSection.classList.add('d-none');
    }
};

const modalDetailElement = document.getElementById('modalDetail1');
modalDetailElement.addEventListener('hidden.bs.modal', function () {
    toggleEditMode(false);
});

const formEdit = document.getElementById('edit-project');
const editFileInput = document.getElementById('editGroupFile02');

if (formEdit) {
    formEdit.addEventListener('submit', async function (event) {
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;
        
        const activeId = parseInt(document.getElementById('btnDeleteProject').getAttribute('data-id'));
        
        const projectIndex = projects.findIndex(p => p.id === activeId);
        let imageBase64 = projects[projectIndex].image; // Pakai gambar lama dulu

        if (editFileInput.files.length > 0) {
            const fileSizeKB = editFileInput.files[0].size / 1024;
            if (fileSizeKB > 500) {
                editFileInput.setCustomValidity('Ukuran file maksimal 500KB.');
                isValid = false;
            } else {
                editFileInput.setCustomValidity('');
                imageBase64 = await getBase64(editFileInput.files[0]);
            }
        } else {
            editFileInput.setCustomValidity('');
        }

        if (!formEdit.checkValidity()) isValid = false;
        formEdit.classList.add('was-validated');

        if (!isValid) {
            Swal.fire({ icon: 'error', title: 'Form Belum Lengkap!' });
            return;
        }

        projects[projectIndex].title = document.getElementById('editNameProject').value;
        projects[projectIndex].desc = document.getElementById('editDetailProject').value;
        projects[projectIndex].creator = document.getElementById('editCreator').value;
        projects[projectIndex].division = document.getElementById('editSelectDivision').value;
        projects[projectIndex].url = document.getElementById('editUrlProject').value;
        projects[projectIndex].image = imageBase64;

        saveToLocalStorage(); 

        Swal.fire({ 
            title: 'Memperbarui Data...', 
            allowOutsideClick: false, 
            didOpen: () => { 
                Swal.showLoading(); 
            } });

        setTimeout(() => {
            Swal.fire({ 
                icon: 'success', 
                title: 'Diperbarui!', 
                showConfirmButton: false, 
                timer: 1500 
            }).then(() => {
                formEdit.classList.remove('was-validated');
                toggleEditMode(false); 
                bootstrap.Modal.getInstance(document.getElementById('modalDetail1')).hide();
                renderProjects();
            });
        }, 1000);
    });
}

/**
 * DELETE
 */
const btnDelete = document.getElementById('btnDeleteProject');

if (btnDelete) {
    btnDelete.addEventListener('click', function () {
        const idToDelete = parseInt(this.getAttribute('data-id'));

        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Data project ini akan dihapus secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({ title: 'Menghapus...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

                setTimeout(() => {
                    projects = projects.filter(p => p.id !== idToDelete);
                    saveToLocalStorage(); 

                    Swal.fire('Terhapus!', 'Project berhasil dihapus dari sistem.', 'success').then(() => {
                        bootstrap.Modal.getInstance(document.getElementById('modalDetail1')).hide();
                        renderProjects(); 
                    });
                }, 1000);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
});