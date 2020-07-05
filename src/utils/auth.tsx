import React from 'react'

import HarperDBService from './HarperService'

interface User {
	username: string;
	token: string;
	profile: {
		email: string;
	};
}

interface AuthContextProps {
	signUp: (email: string, username: string, password: string) => Promise<void>;
	signIn: (username: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	setUser: (user: User) => void;
	user?: User;
}

export interface AuthenticatedAuthContext extends AuthContextProps {
	user: User;
}

const asyncNoop = async () => { /* do nothing. */ }

export const AuthContext = React.createContext<AuthContextProps>({
	signUp: asyncNoop,
	signIn: asyncNoop,
	signOut: asyncNoop,
	setUser: () => { /* do nothing. */ }
})

export const useAuth = () => React.useContext(AuthContext)

class AuthError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AuthError'
	}
}

export const AuthProvider: React.FC = ({ children }) => {
	const cachedUser = localStorage.getItem('orp-user')
	const [user, _setUser] = React.useState<User | undefined>(cachedUser ? JSON.parse(cachedUser) : undefined)

	const setUser = (user: User) => {
		localStorage.setItem('orp-user', JSON.stringify(user))
		return _setUser(user)
	}

	const signUp = async (email: string, username: string, password: string) => {
		const createUserRes = await HarperDBService.createUser(username, password)
		if (createUserRes.message.match('successfully added')) {
			const token = Buffer.from(`${username}:${password}`).toString('base64')

			const createResearcherRes = await HarperDBService.createResearcher(token, username, { email })

			if (createResearcherRes.message.match('inserted 1 of 1 records')) {
				setUser({
					token,
					username,
					profile: {
						email
					}
				})
			} else {
				throw new AuthError(createResearcherRes)
			}
		} else {
			throw new AuthError(createUserRes)
		}
	}

	const signIn = async (username: string, password: string) => {
		const token = Buffer.from(`${username}:${password}`).toString('base64')
		console.log(token)
		try {
			const userInfo = await HarperDBService.getUser(token)
			const getResearcherRes = await HarperDBService.readResearcher(token, userInfo.username)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const {__createdTime__, __updatedTime__, username, ...profile } = Array.isArray(getResearcherRes) ? getResearcherRes[0] : getResearcherRes
			setUser({ token, username: userInfo.username, profile })
		} catch (error) {
			if (error.message === 'Login failed') {
				throw new AuthError('Invalid login, try again.')
			} else {
				throw new AuthError(error.message)
			}
		}
	}

	const signOut = async () => {
		localStorage.removeItem('orp-user')
		_setUser(undefined)
	}

	const options = {
		user,
		setUser,
		signUp,
		signIn,
		signOut,
	}

	return <AuthContext.Provider value={options} >{children}</AuthContext.Provider>
}