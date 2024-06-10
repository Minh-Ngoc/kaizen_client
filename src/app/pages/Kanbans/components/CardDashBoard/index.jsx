const CardDashBoard = ({ name, data, icon }) => {
	return (
		<div className="xl:col-span-3 lg:col-span-4 md:col-span-6">
			<div className="shadow-wrapper flex flex-col gap-3 p-6 overflow-hidden bg-card-project hover:bg-gradient-to-br rounded-2xl duration-300 hover:shadow-2xl group">
				<p className="text-lg text-center font-semibold capitalize text-gray-200">
					{name}
				</p>

				<div className="flex flex-row gap-5 justify-center items-center">
					<h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-gray-50">
						{data}
					</h1>
					{/* <div class="p-3 rounded-2xl"> */}
						{icon}
					{/* </div> */}
				</div>
			</div>
		</div>
	);
};

export default CardDashBoard;
