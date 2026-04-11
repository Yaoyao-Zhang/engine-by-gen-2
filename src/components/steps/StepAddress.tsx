"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
  "DC","PR","VI",
];

export function StepAddress() {
  const { register, formState: { errors } } = useFormContext<LoanApplicationFormData>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        What&apos;s your address?
      </h1>

      <div className="space-y-5">
        <div>
          <input
            type="text"
            {...register("address1")}
            placeholder="Street address"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 ${
              errors.address1 ? "border-red-400" : "border-gray-300 focus:border-emerald-500"
            }`}
          />
          {errors.address1 && (
            <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>
          )}
        </div>

        <input
          type="text"
          {...register("address2")}
          placeholder="Apt #, Suite, Bldg"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-900"
        />

        <div>
          <input
            type="text"
            {...register("city")}
            placeholder="City"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 ${
              errors.city ? "border-red-400" : "border-gray-300 focus:border-emerald-500"
            }`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <select
              {...register("state")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900 ${
                errors.state ? "border-red-400" : "border-gray-300 focus:border-emerald-500"
              }`}
              defaultValue=""
            >
              <option value="" disabled>State</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <input
              type="text"
              {...register("zipcode")}
              placeholder="Zip"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 ${
                errors.zipcode ? "border-red-400" : "border-gray-300 focus:border-emerald-500"
              }`}
            />
            {errors.zipcode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipcode.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
