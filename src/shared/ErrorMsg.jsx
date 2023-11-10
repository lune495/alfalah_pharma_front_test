import React from "react";

export default function ErrorMsg({errorMsg,show, hide }) {

	return (
		show  && (
			<div
				className='alert alert-danger alert-dismissible fade show'
				role='alert'>
				<strong>{errorMsg}</strong>
				<button
					type='button'
					onClick={hide}
					className='close'
					data-dismiss='alert'
					aria-label='Close'>
					<span aria-hidden='true'>&times;</span>
				</button>
			</div>
		)
	);
}
