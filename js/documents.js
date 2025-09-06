import docs from './docs.js';

function createDocumentCard(doc) {
    return `
        <div class="bg-[var(--bg-color)] p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-[var(--border-color)]">
            <div class="flex flex-col space-y-4">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-[var(--accent-color)]/10 rounded-full flex items-center justify-center">
                        <i class="${doc.icon} text-[var(--accent-color)] text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-[var(--text-color)]">${doc.title}</h3>
                        <span class="text-sm text-[var(--text-color)]/60">${doc.category} • ${doc.access}</span>
                    </div>
                </div>
                <p class="text-[var(--text-color)]/80">${doc.description}</p>
                <a href="${doc.link}" 
                   target="_blank"
                   class="inline-flex items-center px-4 py-2 bg-[var(--accent-color)] text-[var(--bg-color)] font-semibold rounded-lg shadow-md hover:bg-[var(--accent-dark)] hover:scale-105 transition-all duration-300">
                    <i class="fas fa-external-link-alt mr-2"></i>
                    Open Document
                </a>
            </div>
        </div>
    `;
}

function loadDocuments() {
    const container = document.getElementById('documents-container');
    if (!container) return;

    docs.forEach(doc => {
        const card = createDocumentCard(doc);
        container.insertAdjacentHTML('beforeend', card);
    });
}

// Load documents when the DOM is ready
document.addEventListener('DOMContentLoaded', loadDocuments); 