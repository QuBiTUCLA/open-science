import React, { FormEventHandler } from 'react'
import { useAuth, AuthenticatedAuthContext } from '../utils/auth'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import HarperDBService from '../utils/HarperService'

const CreatePost = () => {
	const { user } = useAuth() as AuthenticatedAuthContext
	const [content, setContent] = React.useState('')
	const [isAnonymous, setIsAnonymous] = React.useState(true)
	const [error, setError] = React.useState<string>()
	const [success, setSuccess] = React.useState<string>()

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()
		setError(undefined)

		try {
			const createPostRes = await HarperDBService.createPost(user.token, user.username, { content, anonymous: isAnonymous })
			if (createPostRes.message.match('inserted 1 of 1 records')) {
				setSuccess('Post Created!')
			} else {
				setError(createPostRes.message)
			}
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<Row>
			<Col xs={12} sm={6}>
				<h2>Create Post</h2>
				<Form onSubmit={handleSubmit}>
					{
						error && (
							<Form.Text className="text-danger">
								{error}
							</Form.Text>
						)
					}
					<Form.Group controlId='content'>
						<Form.Label>Post</Form.Label>
						<Form.Control 
							as='textarea'
							placeholder='Post content'
							value={content}
							onChange={(event) => {
								setContent(event.target.value)
							}}
							required
						/>
					</Form.Group>
					<Form.Group controlId='isAnonymous'>
						<Form.Check 
							type='checkbox'
							placeholder='Post content'
							label='Publish Anonymously'
							checked={isAnonymous}
							onChange={() => {
								setIsAnonymous(!isAnonymous)
							}}
						/>
					</Form.Group>
					<Button variant='primary' type='submit'>Create Post</Button>
					{
						success && (
							<Form.Text className="text-success">
								{success}
							</Form.Text>
						)
					}
				</Form>
			</Col>
		</Row>
	)
}

export default CreatePost