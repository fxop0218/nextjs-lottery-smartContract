import Head from "next/head"
import styles from "../styles/Home.module.css"
import { Header } from "../components/Header"
import { RaffleEntrance } from "../components/RaffleEntance"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Web3 decentralised raffle</title>
            </Head>
            <Header />
            <RaffleEntrance />
        </div>
    )
}
