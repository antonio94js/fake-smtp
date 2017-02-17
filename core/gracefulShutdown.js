const gracefulShutdown = (STMPserver) => {
    // console.log(STMPserver);
    STMPserver.close(function (err) {
		if(err) return process.exit(1);

		process.exit(0)
	})
};

export default gracefulShutdown;
