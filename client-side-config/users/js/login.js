let container = document.getElementById('container')

toggle = () => {
	container.classList.toggle('sign-in')
	container.classList.toggle('sign-up')
}

setTimeout(() => {
	container.classList.add('sign-in')
}, 200)

document.getElementById('forgotPasswordText').addEventListener('click', () => {
	document.getElementById('forgotPasswordModal').style.display = 'block';
	
	document.getElementById('email').value = '';
});


function closeForgotPasswordModal() {
	document.getElementById('forgotPasswordModal').style.display = 'none';
	document.getElementById('email').value = '';
}


document.getElementById('forgotPasswordForm').addEventListener('submit', async (event) => {
	event.preventDefault();
	const email = document.getElementById('forgot_email').value; 
	console.log('Fetching password reset for email:', email); 

	try {
		const response = await fetch(`http://localhost:3000/api/v1/https/password/forgot`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email }) 
		});

		if (!response.ok) {
			const errorMessage = await response.text();
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: errorMessage
			});
			return;
		}

		const data = await response.json();
		Swal.fire({
			icon: 'success',
			title: 'Success!',
			text: data.message
		});
		closeForgotPasswordModal(); 
	} catch (error) {
		console.error('Error:', error);
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'An error occurred. Please try again later.'
		});
	}
});
			









