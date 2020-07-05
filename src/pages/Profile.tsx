import React, { FormEventHandler } from 'react'
import { useAuth, AuthenticatedAuthContext } from '../utils/auth'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import HarperDBService from '../utils/HarperService'

const Profile = () => {
	const { user, setUser } = useAuth() as AuthenticatedAuthContext
	const [error, setError] = React.useState<string>()
	const [success, setSuccess] = React.useState<string>()
	const [email, setEmail] = React.useState<string>(user.profile.email)

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()
		setError(undefined)

		try {
			const updateResearcherRes = await HarperDBService.updateResearcher(user.token, user.username, { email })
			if (updateResearcherRes.message.match('updated 1 of 1 records')) {
				const getResearcherRes = await HarperDBService.readResearcher(user.token, user.username)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const {__createdTime__, __updatedTime__, username, ...profile } = Array.isArray(getResearcherRes) ? getResearcherRes[0] : getResearcherRes
				setUser({ ...user, profile })
				setSuccess('Profile Updated!')
			} else {
				setError(updateResearcherRes)
			}
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<Row>
			<Col xs={12} sm={6} md={4}>
				<h2>Profile</h2>
				<Form onSubmit={handleSubmit}>
					{
						error && (
							<Form.Text className="text-danger">
								{error}
							</Form.Text>
						)
					}
					<Form.Group controlId='email'>
						<Form.Label>Email</Form.Label>
						<Form.Control 
							type='text'
							placeholder='example@email.com'
							value={email}
							onChange={(event) => {
								setEmail(event.target.value)
							}}
							required
						/>
					</Form.Group>
					<Button variant='primary' type='submit'>Update Profile</Button>
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

export default Profile