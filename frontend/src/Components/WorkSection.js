import React from "react";

const WorkSection = ({ title, category }) => {
    return (                
        <div className="bg-base-100 pr-5 max-w-md my-3 mr-8 mx-4 p-4 shadow-glow rounded-lg">
            <div className="flex justify-between items-center ">
                
                <div className="flex flex-col justify-center">
                    <h3 className="card-title">{title}</h3>
                    <p>{category}</p>
                </div>

                <div className="card-actions">
                    <button className="text-white btn btn-primary min-h-0 h-8 leading-tight">Manage</button>
                </div>

            </div>
        </div>
    )
}

export default WorkSection;