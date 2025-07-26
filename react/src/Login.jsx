'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { loginUser } from './api/user'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Mail } from 'lucide-react'

export default function LoginPage({ onSwitchToRegister }) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		setIsLoading(true)
		localStorage.setItem('username', username)
		const errorMsg = await loginUser(username, password)
		if (errorMsg) {
			console.log(errorMsg);
		}

		// Simulate login process
		setTimeout(() => {
			console.log('Login attempt:', { username, password })
			setIsLoading(false)
		}, 1000)
	}

	const handleMagicLink = () => {
		console.log('Magic link requested')
		// Handle magic link logic here
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg--50 px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Welcome back
					</CardTitle>
					<CardDescription className="text-center">
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="Enter your username"
								value={username}
								onChange={e => setUsername(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Enter your password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
									<span className="sr-only">
										{showPassword ? 'Hide password' : 'Show password'}
									</span>
								</Button>
							</div>
						</div>

						<div className="flex justify-center">
							<div className="flex items-center space-x-2 mb-2 ">
								<input
									id="remember"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300"
								/>
								<Label htmlFor="remember" className="my-2 text-sm font-normal">
									Remember me
								</Label>
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-muted-foreground">Or</span>
							</div>
						</div>

						<Button
							type="button"
							variant="outline"
							className="w-full bg-transparent"
							onClick={handleMagicLink}>
							<Mail className="mr-2 h-4 w-4" />
							Continue with Magic Link
						</Button>

						<p className="text-center text-sm text-muted-foreground">
							Don't have an account?{' '}
							<Button
								variant="link"
								className="px-0 font-normal"
								onClick={onSwitchToRegister}>
								Sign up
							</Button>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
