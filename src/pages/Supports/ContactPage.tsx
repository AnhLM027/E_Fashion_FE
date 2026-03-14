import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-semibold">
            Liên hệ với chúng tôi
          </h1>

          <p className="mt-4 text-zinc-500 max-w-xl mx-auto text-sm">
            Nếu bạn có câu hỏi về sản phẩm, đơn hàng hoặc cần hỗ trợ, đội ngũ
            STYLE luôn sẵn sàng giúp bạn.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <ContactInfoItem
              icon={<Mail className="w-5 h-5" />}
              title="Email hỗ trợ"
              content="support@style.vn"
              subContent="Phản hồi trong vòng 24 giờ"
            />

            <ContactInfoItem
              icon={<Phone className="w-5 h-5" />}
              title="Hotline"
              content="1900 1234"
              subContent="8:00 – 21:00 mỗi ngày"
            />

            <ContactInfoItem
              icon={<MapPin className="w-5 h-5" />}
              title="Địa chỉ"
              content="Thanh Xuân, Hà Nội"
              subContent="Trụ sở chính STYLE"
            />
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-zinc-50 rounded-2xl p-8 md:p-10 border border-zinc-100"
          >
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-5 h-5 text-zinc-700" />
              <h2 className="text-xl font-medium">
                Gửi tin nhắn cho chúng tôi
              </h2>
            </div>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* NAME */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-600">Họ và tên</label>

                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-600">Email</label>

                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition"
                />
              </div>

              {/* MESSAGE */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-zinc-600">Nội dung</label>

                <textarea
                  rows={4}
                  placeholder="Bạn cần hỗ trợ điều gì?"
                  className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition resize-none"
                />
              </div>

              {/* BUTTON */}
              <div className="md:col-span-2 pt-2">
                <button className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition">
                  Gửi tin nhắn
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon, title, content, subContent }: any) {
  return (
    <div className="flex items-start gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-zinc-200 transition">
      <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-lg">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-900">{title}</p>

        <p className="text-sm text-zinc-700">{content}</p>

        <p className="text-xs text-zinc-400">{subContent}</p>
      </div>
    </div>
  );
}
