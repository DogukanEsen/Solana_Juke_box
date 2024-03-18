# Project name

Sol Juke Box

# Who are you

Dogukan Esen

# Project details

A Jukebox powered by SOL. In the application of the project, 3 songs are selected randomly or with a specific algorithm. Users can vote on these 3 songs with a low Solana fee, and the song with the highest votes will be played. Users send their votes to that address, for example, 0.01 SOL. During voting, users can enter a message within a certain character limit, and the song that has raised the most money will play. A message may pass at the bottom of the screen while playing.

The collected money is distributed proportionally among the rights holders, application developers, and venue through a smart contract. During voting, users can enter a message within a certain character limit, and the song that has raised the most money will play. A message may pass at the bottom of the screen while playing. Participants can be awarded NFTs for each song.

Currently, the project offers song voting via PDAs (Program Derived Accounts) and the service of transferring collected funds to a designated account. The song that receives 10 votes wins.

# Vision

İnsanların gittikleri kafelerde, mekanlarda ya da kendi düzenledikleri partilerde daha fazla eğlenmesini sağlamak.

# Project Description

Introducing SOL Jukebox, a decentralized music platform on Solana Blockchain. Users engage by voting for one of three randomly selected songs using a low Solana fee (e.g., 0.01 SOL). Votes include optional messages. The song with the most votes plays, with messages displayed during playback. Funds collected are distributed among rights holders, developers, and venues via a smart contract. Additionally, participants can earn unique NFTs for each song. This innovative project promotes community engagement, fair compensation for creators, and seamless music experiences on the blockchain. Join SOL Jukebox to democratize music selection and support artists while enjoying personalized tunes.

# Vision Statement

SOL Jukebox envisions revolutionizing the music industry by empowering users to democratically select songs on the Solana Blockchain. Through transparent voting and fair compensation mechanisms, we aim to foster community engagement, support artists, and enhance music discovery. By leveraging blockchain technology, we strive to create a decentralized platform that ensures equitable distribution of funds among rights holders, developers, and venues. Our vision is to redefine the music listening experience, promote artist sustainability, and establish a new paradigm for fair and transparent music ecosystems. Join us in shaping the future of music with SOL Jukebox.

# Development Plan

## Smart Contract Design and Development:

Define and implement the smart contract functionalities including:

1. Song selection algorithm
2. Voting mechanism
3. Fund distribution logic
4. NFT minting for participants

## Front-end Design and Development:

Design and develop the user interface for the SOL Jukebox application including:

1. Song selection interface
2. Voting mechanism
3. Message input functionality
4. Playback interface with scrolling messages

## Integration of Smart Contract with Front-end:

Integrate the developed smart contract functionalities with the front-end application to enable seamless interaction between users and the blockchain.

## Testing and Debugging:

Thoroughly test the smart contract and front-end application for any bugs, security vulnerabilities, and usability issues. Conduct both unit tests and end-to-end tests to ensure the reliability and functionality of the system.

## User Acceptance Testing (UAT):

Invite a group of users to test the SOL Jukebox application and provide feedback on its usability, performance, and overall experience. Incorporate user feedback to refine the application as needed.

## Deployment:

Deploy the smart contract on the Solana Blockchain and publish the front-end application on the web. Ensure proper documentation and support channels are in place for users to access and utilize the SOL Jukebox platform effectively.

# Story Summary

A young musician, struggling to break into the industry, discovers SOL Jukebox. Intrigued by its decentralized model, she uploads her songs and engages with the community. Her track wins the popular vote, earning her fair compensation and exposure. Encouraged by this success, she continues to share her music on the platform, eventually gaining widespread recognition. Through SOL Jukebox, she finds not only a platform for her art but also a supportive community that values transparency and fairness in the music industry.

# How to install the project?

Installation
To install SOL Jukebox, follow these steps:

Clone the repository to your local machine:

`git clone https://github.com/username/SOL-Jukebox.git`

Navigate to the project directory:

`cd SOL-Jukebox/demo-pda`

`anchor build`

`anchor test`

`anchor deploy`

Install dependencies using npm:

`cd /SOL-Jukebox/solana-pda-dapp`

`npm install`

Usage
Once installed, you can run SOL Jukebox locally by following these steps:

Start the Solana local network:

`solana-test-validator`

Start the front-end application:

`npm start`

Open your web browser and navigate to http://localhost:3000 to access the SOL Jukebox application.

### Contributing

Contributions to SOL Jukebox are welcome! If you would like to contribute, please follow these steps:

### Fork the repository on GitHub.

Create a new branch from the main branch for your feature or fix.
Make your changes and commit them with descriptive messages.
Push your changes to your fork.
Submit a pull request to the main branch of the original repository.

### License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it as per the terms of the license.

### Support

For any questions, issues, or feedback, please open an issue on GitHub. We're here to help!

![The San Juan Mountains are beautiful!](/img/wp.png "San Juan Mountains")

# Project Pages

### Main Page

![Main](/img/main.png "Main")

### Voting Page

![Transaction](/img/transaction.png "Transaction")

### Winner Page

![Winner](/img/Winner.png "Winner")
