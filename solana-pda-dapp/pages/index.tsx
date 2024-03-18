import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { AppBar } from "../components/AppBar";
import Head from "next/head";
import { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

//Smart Contract içeri alma.
const idl = require("../public/idl.json");

const Home: NextPage = () => {
  // Use state tanımı. Bu değerler ekranda gösterilecek o yüzden bu yöntem tercih edildi.
  const [Data_red, setData_red] = useState<string>("");
  const [Data_green, setData_green] = useState<string>("");
  const [Data_blue, setData_blue] = useState<string>("");
  const [Winner, setWinner] = useState<string>("");

  // Toplanan sol ların gideceği adres.
  const Pay_Address = new web3.PublicKey(
    "Gnqf62tB4mH5kT9nPbLqoC9NKjx9XkAdgKapQro6DBky"
  );

  //Shortkey bulmak için helper fonksiyon
  function shortKey(key: web3.PublicKey) {
    return key.toString().substring(0, 8);
  }

  const anchorWallet = useAnchorWallet();
  //Burada şarkı seçme işlemi bittikten sonra sonraki şarkıda yeni adres kullanmak gerektiğinden oluşturuldu. Devnette airdrop işlemi kısa bir süre sonra askıya alınıyor. Localde denenebilir o yüzden.
  async function Keypair_Generator(provider: AnchorProvider) {
    let testKeypair1 = web3.Keypair.generate();

    await provider.connection.requestAirdrop(
      testKeypair1.publicKey,
      2 * web3.LAMPORTS_PER_SOL
    );
    await new Promise((resolve) => setTimeout(resolve, 3 * 1000)); // Sleep 3s
    return testKeypair1;
  }

  //Butonlara tıklanıldığında gelinen yer burası. Burada renge göre ayrım yapılıyor.
  async function sendTransaction({ color }: { color: string }) {
    // const testKeypair1 = web3.Keypair.fromSecretKey(
    //   new Uint8Array([

    //   ])
    // ); // Devnette sürekli keypair oluşturma bana sebep olabileceği için oluşturulmuş hesap.

    if (!anchorWallet) {
      return;
    }
    // Ağ seçimi, smart contract yüklenmesi vb.
    const network = "https://api.devnet.solana.com";
    // const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "processed",
    });
    const program = new Program(idl, idl.metadata.address, provider);

    const testKeypair1 = await Keypair_Generator(provider); // Yeni hesap açımında airdrop istendiği için devnette ban yenilebilir. Sadece localde daha uygun.
    //Seçilen şarkıya 1 oy verilmesi için.
    modifyLedger(color, 1, testKeypair1, program);
    //Şarkı seçildikten sonra Pay_Address' e sol aktarımını sağlayan parça.
    await Transacion_Sol(connection);
    // Ekranda, konsolda oy sayısını göstermek için
    show_balance(testKeypair1, program);
  }

  // Burada Phantom wallet' tan Pay_Address' e transfer işlemi gerçekleşiyor.
  async function Transacion_Sol(connection: web3.Connection) {
    if (!anchorWallet) {
      return;
    }
    // Transfer ücreti 0.001 sol belirlendi.
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: anchorWallet.publicKey,
        toPubkey: Pay_Address,
        lamports: 0.001 * LAMPORTS_PER_SOL,
      })
    );
    // İşlemlerin Phantom wallet tarafından onaylanması için gerekli kodlar

    const latestBlockHash = await connection.getLatestBlockhash();
    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = anchorWallet.publicKey;
    // İşlemi imzala
    const signedTransaction = await anchorWallet.signTransaction(transaction);

    // İşlemi gönder ve onayla
    const transactionId = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: transactionId,
    });
  }

  // Pda account oluşturma fonksiyonu
  async function createLedgerAccount(
    color: string,
    pda: web3.PublicKey,
    wallet: web3.Keypair,
    program: Program<any>
  ) {
    await program.methods
      .createLedger(color)
      .accounts({
        ledgerAccount: pda,
        wallet: wallet.publicKey,
      })
      .signers([wallet])
      .rpc();
  }

  // Pda' i bulma fonksiyonu
  async function derivePda(
    color: string,
    pubkey: web3.PublicKey,
    program: Program<any>
  ) {
    let [pda, _] = web3.PublicKey.findProgramAddressSync(
      [pubkey.toBuffer(), Buffer.from("_"), Buffer.from(color)],
      program.programId
    );
    return pda;
  }

  // Pda balance güncelleme işlemlerinin yapıldığı yer.
  async function modifyLedger(
    color: string,
    newBalance: number,
    wallet: web3.Keypair,
    program: Program<any>
  ) {
    console.log("--------------------------------------------------");
    let data;
    let pda = await derivePda(color, wallet.publicKey, program);

    console.log(
      `Checking if account ${shortKey(pda)} exists for color: ${color}...`
    );
    // Daha önceden hesap oluşturma durumuna bakıp ona göre hesap oluşturma işlemi.
    try {
      data = await program.account.ledger.fetch(pda);
      console.log("Account found");
    } catch (e) {
      console.log("Account not found. Creating...");
      await createLedgerAccount(color, pda, wallet, program);
      data = await program.account.ledger.fetch(pda);
    }
    newBalance = newBalance + data.balance;
    console.log("Success.");
    console.log("Data:");
    console.log(`    Color: ${data.color}   Balance: ${data.balance}`);
    console.log(
      `balance of ${data.color} from ${data.balance} to ${newBalance}`
    );

    await program.methods
      .modifyLedger(newBalance)
      .accounts({
        ledgerAccount: pda,
        wallet: wallet.publicKey,
      })
      .signers([wallet])
      .rpc();

    data = await program.account.ledger.fetch(pda);
    console.log("New Data:");
    console.log(`    Color: ${data.color}   Balance: ${data.balance}`);
    console.log("Success.");
  }

  // Ekranda balance değerlerinin gösterilmesini sağlayan ve bu değerleri bulan fonksiyon.
  async function show_balance(wallet: web3.Keypair, program: Program<any>) {
    const pda_red = await derivePda("red", wallet.publicKey, program);
    const data_red = await program.account.ledger.fetch(pda_red);

    const pda_green = await derivePda("green", wallet.publicKey, program);
    const data_green = await program.account.ledger.fetch(pda_green);

    const pda_blue = await derivePda("blue", wallet.publicKey, program);
    const data_blue = await program.account.ledger.fetch(pda_blue);

    console.log(
      ` Color: ${data_red.color}   Balance: ${data_red.balance}
        Color: ${data_green.color}   Balance: ${data_green.balance}
        Color: ${data_blue.color}   Balance: ${data_blue.balance}     `
    );
    setData_red(data_red.balance);
    setData_green(data_green.balance);
    setData_blue(data_blue.balance);
    if (data_red.balance >= 10) setWinner("red");
    if (data_green.balance >= 10) setWinner("Green");
    if (data_blue.balance >= 10) setWinner("Blue");
  }

  // Şarkı bilgilerini içeren data
  const data = [
    {
      title: "Solana Sunrise",
      description:
        "Bu şarkı, Solana ekosistemi ve blokzinciri teknolojisinin güneş gibi yükselişini anlatan enerjik bir parçadır. Hızlı işlem süreleri ve düşük ücretler gibi Solana'nın temel özelliklerine atıfta bulunarak, blokzinciri dünyasına yeni bir şafak getiriyor.",
      color: "red",
    },
    {
      title: "SOL Dreams",
      description:
        "'SOL Dreams', Solana blokzinciri üzerinde inşa edilen projelerin vizyonunu ve gelecek vaatlerini vurgulayan bir şarkıdır. Bu parça, Solana ekosisteminin yaratıcı ve yenilikçi potansiyelini öne çıkarırken, hayallerin gerçeğe dönüşme sürecini kutlar.",
      color: "green",
    },
    {
      title: "Riding the SOL Waves",
      description:
        "Bu şarkı, Solana'nın hızlı büyüme ivmesini ve giderek artan popülerliğini anlatan bir tema taşır. SOL tokeninin yükselişi ve Solana tabanlı projelerin heyecan verici gelişmeleri, bu parçanın temel unsurlarını oluşturur.",
      color: "blue",
    },
  ];

  return (
    <div className={styles.App}>
      <Head>
        <title>Juke Box</title>
        <meta name="description" content="Juke Box" />
      </Head>
      <AppBar />
      <br />
      <br />
      <br />
      <br />
      {/* Map işlemi ile 3 tane şarkı çıkarılıyor.  */}
      <Grid container spacing={4} justifyContent="center">
        <Grid xs />
        {data.map((item, index) => (
          <Grid key={index} xs={3}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  color="inherit"
                  sx={{ bgcolor: item.color }}
                  onClick={(e: any) => sendTransaction({ color: item.color })}
                >
                  0.001 Sol Oy Gönder !!!
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid xs />
      </Grid>
      <br />
      <br />
      {/* Kazanan şarkı belirlendiğinde ismi çıkacak */}
      <Typography
        variant="h1"
        color="white"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Winner Song is {Winner} !!!
      </Typography>
      <br />
      <br />
      {/* Şarkılar ve oyları */}
      <Typography
        variant="body2"
        color="white"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Red - 1. Song: {Data_red}
      </Typography>
      <br />
      <br />
      <Typography
        variant="body2"
        color="white"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Green - 2. Song: {Data_green}
      </Typography>
      <br />
      <br />
      <Typography
        variant="body2"
        color="white"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Blue - 3. Song: {Data_blue}
      </Typography>
    </div>
  );
};

export default Home;
