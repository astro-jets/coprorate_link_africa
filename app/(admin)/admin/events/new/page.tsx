"use client"
import "@uploadthing/react/styles.css";
import { UploadButton } from "@/utils/uploadthing";
import React, { useState } from 'react';
import Modal from "@/app/(admin)/components/Modal";
import { postEvent } from '@/app/action';
import Image from "next/image";
import { BsCalendar, BsClock, BsExclamationCircle, BsX } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";

// Initial state with types
type FormData = {
    title: string;
    description: string;
    eventDate: string;
    time: string;
    venue: string;
    images: { url: string; key: string; }[]
};

const initialFormData: FormData = {
    title: "",
    description: "",
    eventDate: "",
    venue: "",
    time: "",
    images: [{ url: "", key: "" }],
};

const NewEvent = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [formKey, setFormKey] = useState<number>(0);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [images, setImages] = useState<{ url: string; key: string; }[]>([])
    const [errMsg, setErrMsg] = useState(true);

    const handleSubmit = async () => {

        if (images.length < 1) {
            setErrMsg(false);
            return;
        } else { formData.images = images; }
        console.log("file", formData);
        const response = await postEvent(formData)
        console.log("Response => ", response);
        if (response.status === "true") {
            setIsModalOpen(true);
            setFormKey((prevKey) => prevKey + 1);
            setFormData(initialFormData);
        }
    };

    const handleImagesUpload = (res: any) => {
        setImages(res)
        formData.images = images;
        const json = JSON.stringify(res);
        console.log(json);
        alert("Upload Completed");
    }

    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto relative overflow-hidden">
            <div className="max-w-xl mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
                        Create new event
                    </h1>
                </div>
                {
                    errMsg ? (null) :
                        <div className="-mx-3 mt-4 h-screen w-full flex items-center justify-center bg-[#000000a9] absolute top-0 right-0">
                            <div className="w-3/4  bg-red-700 text-white h-20 flex  items-center justify-center rounded-2xl ">
                                <div className="w-11/12 flex space-x-3">
                                    <BsExclamationCircle size={20} color={"#fff"} />
                                    <p className="w-3/4">No Image Uploaded</p>
                                </div>
                                <button className={"cursor-pointer"} onClick={() => setErrMsg(true)}>
                                    <BsX size={25} color={"#fff"} />
                                </button>
                            </div>

                        </div>
                }

                <div className="mt-12">
                    {/* Form */}
                    <form key={formKey}>
                        <div className="grid gap-4 lg:gap-6">
                            <div>
                                <label htmlFor="title" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Event Title</label>
                                <input type="text" name="title" id="title" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            title: e.target.value
                                        })
                                    }}
                                    value={formData.title}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                {
                                    images[0]?.url ? null :
                                        <div>
                                            <label htmlFor="blog-image" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Event Image</label>
                                            <UploadButton
                                                endpoint="singleImage"
                                                onClientUploadComplete={(res) => {
                                                    if (res) {
                                                        // Do something with the response
                                                        handleImagesUpload(res);
                                                    }
                                                }}
                                                onUploadError={(error: Error) => {
                                                    // Do something with the error.
                                                    alert(`ERROR! ${error.message}`);
                                                }}
                                            />
                                        </div>
                                }

                                {
                                    images[0]?.url ?
                                        <div className="">
                                            <div className="w-full h-60 rounded overflow-hidden">
                                                <Image width={1000} height={1000} src={images[0].url} className="w-full h-full object-cover" alt="Event Thumbnail" />
                                            </div>
                                        </div> : null
                                }
                            </div>

                            <div className="flex justify-between sm:grid-cols-2 gap-4 lg:gap-6">
                                {/* Time */}
                                <div>
                                    <label htmlFor="time" className="flex space-x-2 mb-2 text-sm text-gray-700 font-medium dark:text-white"><BsClock size={20} color={"#fff"} /> <p>Time</p></label>
                                    <input type="text" name="time" id="time" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                time: e.target.value.toLocaleLowerCase()
                                            })
                                        }}
                                        value={formData.time}
                                    />
                                </div>
                                {/* eventDate */}
                                <div>
                                    <label htmlFor="eventDate" className="flex space-x-2 mb-2 text-sm text-gray-700 font-medium dark:text-white"><BsCalendar size={20} color={"#fff"} /> <p>eventDate</p></label>
                                    <input type="text" name="eventDate" id="eventDate" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                eventDate: e.target.value
                                            })
                                        }}
                                        value={formData.eventDate}
                                    />
                                </div>

                                {/* Venue */}
                                <div>
                                    <label htmlFor="venue" className="flex space-x-2 mb-2 text-sm text-gray-700 font-medium dark:text-white"><FaMapMarkerAlt size={20} color={"#fff"} /> <p>Location</p></label>
                                    <input type="text" name="venue" id="venue" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                venue: e.target.value.toLocaleLowerCase()
                                            })
                                        }}
                                        value={formData.venue}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Event Description</label>
                                <textarea id="description" wrap="hard" name="description" rows={10} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
                                        })
                                    }}
                                    value={formData.description}
                                ></textarea>
                            </div>

                        </div>
                        {/* End Grid */}

                        <div className="mt-6 grid">
                            <button type="button"
                                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                onClick={handleSubmit}>Post Event
                            </button>
                        </div>
                    </form>
                    {/* End Form */}
                    <Modal isOpen={isModalOpen} message="Article created successfully" onClose={() => setIsModalOpen(false)} />
                </div>
            </div>
        </div>
    );
};

export default NewEvent;