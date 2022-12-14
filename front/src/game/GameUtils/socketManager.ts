import { io, Socket } from 'socket.io-client'
import {playerT, gameCollionInfoT, availableLobbiesT, Ball, GameData, Player, GameSettings, GameMode} from "./type"

let socket:Socket

export function initiateSocket(url:string, setSocket:any, sessioninfo?:{sessionId:string, roomId:string}, login?:string)
{
	socket = io(url, { autoConnect: false });
	setSocket(socket)
	if (sessioninfo)
		socket.auth = sessioninfo;
	else
		socket.auth = { login } 
	socket.connect();
}

export function joinQueue(mode:GameMode) {
	socket?.emit("joinedQueue", mode);
	
}

export function sendPosition(player:playerT) {
	socket?.emit("playerPosChanged", player);
}

export function sendCollisionInfo(collisionInfo:gameCollionInfoT) {
	socket?.emit("gameCollisionChange", collisionInfo);
}

export function startGame()
{
	socket?.emit("startGame");
}

export function spectacteGame(id:string)
{
	socket?.emit("spectacteGame", id);
}


export function GameMenuHandler(handleAvailableLobbies:any, handleGoalScored:any, handleSession:any)
{
	socket.on("connect", () => {
		socket.on('activeGames',(availableLobbies:availableLobbiesT) => handleAvailableLobbies(availableLobbies))
		})
		socket.on("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, socket));

}

export function GameRoutineHandler(handleWait:any,
									handleUpdateBall:any,
									updatePaddle:any,
									handleGameReady:any,
									handlegameData:any,
									handleGoalScored:any,
									handleSpectateSuccess:any,
									handleGameOver:any,
									handleSession:any) 
{	
	socket.on('waitingForOpponent', handleWait)
	socket.on('updateBall', (ball:Ball) => handleUpdateBall(ball))
	socket.on('updatePaddle', ({playerId, newPos}) => updatePaddle(playerId, newPos))
	socket.on('gameReady', (data: {gameData: GameData, gameSettings: GameSettings, mode: GameMode}) => handleGameReady(data))
	socket.on('gameData', (data: {gameData: GameData, gameSettings: GameSettings}) => handlegameData(data))
	socket.on('goalScored', (scores: {player1: number, player2: number}) => handleGoalScored(scores))
	socket.on('spectateSuccess', (data: {gameData: GameData, gameSettings: GameSettings }) => handleSpectateSuccess(data))
	socket.on('gameOver', (winnerId: string) =>{		; handleGameOver(winnerId)})
	socket.on("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, socket));

}

export function getActiveGames()
{
	socket?.emit("getActiveGames")
}

export function Menucleaner(handleAvailableLobbies:any,
							handleGoalScored:any) {
	socket.off("connect", () => {
		socket.off('activeGames',(availableLobbies:availableLobbiesT) => handleAvailableLobbies(availableLobbies))
		})
		socket.off('goalScored', (players: any) => handleGoalScored(players));
}

export function GameCleaner(handleWait:any,
							handleUpdateBall:any,
							updatePaddle:any,
							handleGameReady:any,
							handlegameData:any,
							handleGoalScored:any,
							handleSpectateSuccess:any,
							handleGameOver:any,
							handleSession:any)
{
	socket.off('waitingForOppoffent', handleWait)
	socket.off('updateBall', (ball:Ball) => handleUpdateBall(ball))
	socket.off('updatePaddle', ({playerId, newPos}) => updatePaddle(playerId, newPos))
	socket.off('gameReady', (data: {gameData: GameData, gameSettings: GameSettings}) => handleGameReady(data))
	socket.off('gameData', (data: {gameData: GameData, gameSettings: GameSettings}) => handlegameData(data))
	socket.off('goalScored', (players: Player[]) => handleGoalScored(players))
	socket.off('spectateSuccess', (players: Player[]) => handleSpectateSuccess(players))
	socket.off('gameOver', (winnerId: string) => handleGameOver(winnerId))
	socket.off("session", (sessionInfo:{sessionId:string, userId:string}) => handleSession(sessionInfo, socket));
}

export function getSocket()
{
	return socket
}