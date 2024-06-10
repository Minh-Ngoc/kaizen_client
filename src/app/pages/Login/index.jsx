/*!

=========================================================
* Vision UI PRO Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-dashboard-pro-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Chakra imports

// Assets
import illustration from "assets/img/illustration-auth.png";

// Custom components
import { login } from "services/api.service";
import { useDispatch } from "react-redux";
import { handleLogin } from "_redux/slice/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button, Image, Input } from "@nextui-org/react";
import NotifyMessage from "_utils/notify";

function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		username: {
			label: "Tên đăng nhập",
			type: "text",
			errorMessage: "",
			placeholder: "John@example.com...",
			value: "",
		},
		password: {
			label: "Mật khẩu",
			type: "password",
			errorMessage: "",
			placeholder: "*******",
			value: "",
		},
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleOnChangeInput = (event, field) => {
		const { value } = event?.target ?? event;

		setForm((prevForm) => ({
			...prevForm,
			[field]: {
				...prevForm[field],
				value: value,
				errorMessage: value ? "" : prevForm[field].errorMessage,
			},
		}));
	};

	const handleChangeTypeInput = (field) => {
		setForm((prev) => ({
			...prev,
			[field]: {
				...prev[field],
				type: prev[field].type === "password" ? "text" : "password",
			},
		}));
	};

	const onSubmit = async () => {
		if (!form?.username.value) {
			setForm((prev) => ({
				...prev,
				username: {
					...prev?.username,
					errorMessage: "Vui lòng nhập Tên đăng nhập!",
				},
			}));

			return;
		}

		if (!form?.password.value) {
			setForm((prev) => ({
				...prev,
				password: {
					...prev?.password,
					errorMessage: "Vui lòng nhập mật khẩu!",
				},
			}));

			return;
		}

		try {
			setIsLoading(true);

			const { data } = await login({
				username: form?.username.value,
				password: form?.password.value,
			});

			if (data.status === 1) {
				dispatch(
					handleLogin({
						...data,
						accessToken: data?.accessToken,
					})
				);

				navigate("/");

                NotifyMessage('Đăng nhập thành công!', 'success')

				return;
			} else {
                NotifyMessage('Đăng nhập thất bại!', 'error')
			}
		} catch (error) {
			console.log("error: ", error);
			if (error?.response?.data?.status === 6) {
                NotifyMessage('Tên Đăng Nhập Hoặc Mật Khẩu Không Đúng!', 'error')
				return;
			}
            NotifyMessage('Đăng nhập thất bại!', 'error');
		} finally {
			setIsLoading(false);
		}
	};

    return (
        <div className="flex relative">
            <div className="flex flex-col min-h-screen h-fit w-full max-w-[1044px] bg-[rgb(28_64_99)]">
                <div className="flex-1 flex items-center justify-center select-none mb-10 px-12">
                    <div className="flex flex-col w-[450px] bg-transparent mt-40 mb-24">
                        <h3 className="text-white text-3xl mb-2 font-bold">
                            Chào mừng đến với Kaizen! 👋
                        </h3>
                        {Object.keys(form)?.map((field) => (
                            <Input
                                key={field}
                                size="lg"
                                variant="bordered"
                                label={form[field]?.label}
                                type={form[field]?.type}
                                labelPlacement={"outside"}
                                placeholder={form[field]?.placeholder}
                                value={form[field]?.value}
                                onChange={(event) => handleOnChangeInput(event, field)}
                                onKeyDown={(event) => event.key === "Enter" && onSubmit()}
                                isInvalid={!!form[field]?.errorMessage}
                                errorMessage={form[field]?.errorMessage}
                                endContent={
                                    (field === "password" && form[field]?.type === "text") ? (
                                        <div onClick={() => handleChangeTypeInput(field)}>
                                            <FaEye className="text-gray-300 cursor-pointer" />
                                        </div>
                                    ) : (field === "password" && form[field]?.type !== "text") ? (
                                        <div onClick={() => handleChangeTypeInput(field)}>
                                            <FaEyeSlash className="text-gray-300 cursor-pointer" />
                                        </div>
                                    ) : <></>
                                }
                                classNames={{
                                    base: "!mt-12",
                                    label: "!text-white !font-medium tracking-wide",
                                    inputWrapper: "py-2 !h-auto data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-primary-400",
                                    input: "text-gray-300 placeholder:text-gray-400",
                                }}
                            />
                        ))}

                        <Button
                            variant="solid"
                            color="primary"
                            onPress={onSubmit}
							isLoading={isLoading}
                            className="mt-6 text-base font-bold h-12 shadow-card-project"
                        >
                            SIGN IN
                        </Button>
                    </div>
                </div>
                <div className="overflow-hidden h-full w-[50vw] absolute right-0">
                    <div className="flex bg-auth justify-center items-center w-full h-full bg-cover bg-center absolute">
                        <Image
                            width={'450px'}
                            src={illustration}
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
