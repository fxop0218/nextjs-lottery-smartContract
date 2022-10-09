import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
// Function to enter the lottery
export const RaffleEntrance = () => {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const [entanceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setrecentWinner] = useState("0")
    const dispatch = useNotification()

    // SmartContract function calls
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: ethers.utils.parseUnits(entanceFee, 18), // Add all the decimals to complete the transaction
    })

    // Call getEntranceFee from contract
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    async function updateUI() {
        const entanceFeeFromCall = (await getEntranceFee()).toString()
        setEntranceFee(ethers.utils.formatUnits(entanceFeeFromCall, "ether"))
        // Set the new number of players
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
        setNumberOfPlayers(numberOfPlayersFromCall)
        // set recent winner
        const recentWinnerFromCall = await getRecentWinner()
        setrecentWinner(recentWinnerFromCall)
    }

    // Functions
    useEffect(() => {
        console.log(isWeb3Enabled)
        if (isWeb3Enabled) {
            // Try to read raffle entrance
            updateUI()
        }
    }, [isWeb3Enabled])

    // When transaction success
    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    // Show notification
    const handleNewNotification = function (tx) {
        dispatch({
            type: "info",
            message: "Transaction completed",
            title: "Transacion notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-1 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-5 w-5 mr-3 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter</div>
                        )}
                    </button>
                    <div className="px-3 py-3">The entrance fee is: {entanceFee} ETH </div>
                    <div className="p-3">Current players: {numberOfPlayers}</div>
                    <div className="p-3">Recent winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No raffle address detected</div>
            )}
        </div>
    )
}
