class ActivitiesController < ApplicationController

    def create
        activity = Activity.create!(activity_params)
        render json: activity, status: :created
    end

    def update
        activity = Activity.find(params[:id])
        activity.update!(activity_params)
        render json: activity, status: :ok
    end

    private

    def activity_params
        params.permit(:activityName)
    end

end
