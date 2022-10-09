import { ConnectButton } from "web3uikit"

export const Header = () => {
    return (
        <div className="border-b-4 p-5 flex flex-row border-blue-500">
            <div className="m-2 font-extrabold text-2xl text-fuchsia-700 ">Web3 Raffle</div>
            <div className="ml-auto py-2 px-3">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
