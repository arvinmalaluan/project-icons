let container = document.getElementById('container')

toggle = () => {
	container.classList.toggle('sign-in')
	container.classList.toggle('sign-up')
}

setTimeout(() => {
	container.classList.add('sign-in')
}, 200)

            // Function to open modal when clicking on text
			document.getElementById('forgotPasswordText').addEventListener('click', () => {
				document.getElementById('forgotPasswordModal').style.display = 'block';
				// Clear input field when modal is opened
				//document.getElementById('email').value = '';
			});
	
			// Function to close modal
			function closeForgotPasswordModal() {
				document.getElementById('forgotPasswordModal').style.display = 'none';
				//document.getElementById('email').value = '';
			}
	
			// Function to handle form submission
			document.getElementById('forgotPasswordForm').addEventListener('submit', async (event) => {
				event.preventDefault();
				const email = document.getElementById('forgot_email').value; // Retrieve the email value from the input field
				console.log('Fetching password reset for email:', email); 
			
				try {
					const response = await fetch(`http://localhost:3000/api/v1/https/password/forgot`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ email }) // Send email as a string, not an object
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
					closeForgotPasswordModal(); // Close modal after submission
				} catch (error) {
					console.error('Error:', error);
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'An error occurred. Please try again later.'
					});
				}
			});
			









