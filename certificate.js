(function(){
	const { jsPDF } = window.jspdf || {};
	function ready(fn){ document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }

	ready(function(){
		const btn = document.getElementById('generateCert');
		if (!btn) return;
		btn.addEventListener('click', function(){
			const name = (document.getElementById('certName') || {}).value || '';
			const course = (document.getElementById('certCourse') || {}).value || '';
			if (!name || !course) { alert('Please enter your name and course.'); return; }
			if (!jsPDF) { alert('PDF library failed to load.'); return; }

			const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
			const width = doc.internal.pageSize.getWidth();
			const height = doc.internal.pageSize.getHeight();

			// Background
			doc.setFillColor(18, 22, 27);
			doc.rect(0, 0, width, height, 'F');

			// Border
			doc.setDrawColor(110, 168, 254);
			doc.setLineWidth(4);
			doc.rect(24, 24, width - 48, height - 48, 'S');

			// Title
			doc.setTextColor(230, 234, 240);
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(36);
			doc.text('Certificate of Completion', width / 2, 140, { align: 'center' });

			// Subtitle
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(14);
			doc.setTextColor(167, 176, 190);
			doc.text('This certificate is proudly presented to', width / 2, 180, { align: 'center' });

			// Name
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(30);
			doc.setTextColor(255, 255, 255);
			doc.text(name, width / 2, 230, { align: 'center' });

			// Course
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(14);
			doc.setTextColor(167, 176, 190);
			doc.text('for successfully completing the course', width / 2, 270, { align: 'center' });
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(18);
			doc.setTextColor(230, 234, 240);
			doc.text(course, width / 2, 300, { align: 'center' });

			// Date and signature line
			const date = new Date().toLocaleDateString();
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(12);
			doc.setTextColor(167, 176, 190);
			doc.text(`Date: ${date}`, 80, height - 100);
			doc.line(width - 260, height - 120, width - 80, height - 120);
			// Signature name
			doc.setFont('helvetica', 'italic');
			doc.setFontSize(16);
			doc.setTextColor(230, 234, 240);
			doc.text('Md.Kaleembasha', width - 170, height - 130, { align: 'center' });
			// Signature label
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(12);
			doc.setTextColor(167, 176, 190);
			doc.text('Authorized Signature', width - 170, height - 100, { align: 'center' });

			// Save
			doc.save(`Certificate-${name.replace(/\s+/g,'_')}.pdf`);
		});
	});
})(); 