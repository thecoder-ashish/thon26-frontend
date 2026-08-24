import React, { useState, useEffect, forwardRef } from "react";
import { CSSTransition } from "react-transition-group";
import { Plus, Eye, EyeOff } from "lucide-react";
import "../styles/transition.css";
import clsx from "clsx";

const RegisterBlock = forwardRef(
  (
    { className, member, saveMemberDetails, copyMember, setCopyMember, index },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(member.name || "");
    const [email, setEmail] = useState(member.email || "");
    const [phone, setPhone] = useState(member.phone || "");
    const [rollno, setRollno] = useState(member.rollno || "");
    const [password, setPassword] = useState(member.password || "");
    const [confirmPassword, setConfirmPassword] = useState(member.confirmPassword || "");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const isLeader = index === 1;

    useEffect(() => {
      saveMemberDetails({
        name,
        email: isLeader ? email : "",
        phone: isLeader ? phone : "",
        rollno,
        password: isLeader ? password : "",
        confirmPassword: isLeader ? confirmPassword : "",
      });
    }, [name, email, phone, rollno, password, confirmPassword, isLeader]);

    return (
      <div className="flex justify-between gap-2 h-full">
        <div
          ref={ref}
          className={clsx(
            "flex flex-col my-4 rounded-md p-3 sm:p-5 border space-y-3 w-[95%]",
            className
          )}
        >
          <div className="flex w-full items-center justify-between gap-2">
            <button
              type="button"
              className={`p-2 active:scale-95 rounded-full flex justify-center items-center h-10 w-10 md:h-12 md:w-12 bg-black dark:bg-white transition-transform transform shrink-0 ${
                isOpen ? "rotate-45" : ""
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Plus className="h-8 w-8 md:h-9 stroke-[2.5px] md:w-9 text-white dark:text-black" />
            </button>
            <div className="flex w-full font-mont items-center justify-between gap-2 min-w-0">
              <input
                type="text"
                placeholder={
                  isLeader
                    ? "TEAM LEADER NAME"
                    : `MEMBER ${index} NAME`
                }
                onClick={() => setIsOpen(true)}
                value={name}
                required
                maxLength="30"
                onChange={(e) => setName(e.target.value.toUpperCase())}
                className="outline-none font-mont w-full bg-transparent ml-1 sm:ml-4 p-1 font-bold text-base sm:text-lg md:text-xl truncate"
              />
              {isLeader && (
                <div className="px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-md font-bold bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 shadow-sm">
                  <span className="font-akira text-[10px] sm:text-xs tracking-wider">
                    LEADER
                  </span>
                </div>
              )}
            </div>
          </div>

          <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="expand"
            unmountOnExit
          >
            <div className="flex">
              <div className="w-full pl-9 md:pl-14 space-y-2 md:mt-2 md:space-y-4">
                {/* Contact Fields only for Team Leader */}
                {isLeader && (
                  <>
                    <input
                      required
                      type="email"
                      maxLength="40"
                      placeholder="LEADER EMAIL"
                      className="outline-none bg-transparent font-mont p-1 mt-2 font-bold text-lg md:text-xl w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toUpperCase())}
                    />
                    <input
                      type="tel"
                      maxLength="10"
                      placeholder="LEADER PHONE NO"
                      className="outline-none bg-transparent p-1 font-bold w-full text-lg md:text-xl"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      required
                    />
                  </>
                )}

                <input
                  type="text"
                  placeholder={
                    isLeader
                      ? "LEADER ROLL NO (e.g. 2026UCA0001)"
                      : `MEMBER ${index} ROLL NO (e.g. 2026UCA000${index})`
                  }
                  value={rollno}
                  required
                  maxLength="16"
                  onChange={(e) => setRollno(e.target.value.toUpperCase())}
                  className="outline-none bg-transparent p-1 font-bold w-full text-lg md:text-xl"
                />

                {/* Password fields — leader only */}
                {isLeader && (
                  <>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="SET TEAM PASSWORD (min. 4 chars)"
                        className="outline-none bg-transparent p-1 font-bold w-full text-lg md:text-xl pr-8"
                        value={password}
                        maxLength="50"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="CONFIRM TEAM PASSWORD"
                        className="outline-none bg-transparent p-1 font-bold w-full text-lg md:text-xl pr-8"
                        value={confirmPassword}
                        maxLength="50"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 font-bold pl-1">
                        ✕ Passwords do not match
                      </p>
                    )}
                    {password && confirmPassword && password === confirmPassword && (
                      <p className="text-xs text-green-500 font-bold pl-1">
                        ✓ Passwords match
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </CSSTransition>
        </div>
      </div>
    );
  }
);

export default RegisterBlock;
