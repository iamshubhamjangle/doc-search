import {
  Card,
  CardDescription,
  CardHeader,
} from "@/app/(client)/_components/ui/card";

const ChatBox = () => {
  const chats = [
    {
      type: "user",
      message:
        "Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful Analysis.",
    },
    {
      type: "bot",
      message:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente nemo ipsum dolore unde, cum vel obcaecati enim? Provident cupiditate earum eius velit quisquam nemo porro consequatur. Explicabo neque sunt ducimus consectetur error magnam doloremque illum eius sequi modi beatae consequatur, nulla aut in quasi voluptatibus. Pariatur modi porro culpa. Eos.",
    },
    {
      type: "user",
      message:
        "Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful Analysis.",
    },
    {
      type: "bot",
      message:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente nemo ipsum dolore unde, cum vel obcaecati enim? Provident cupiditate earum eius velit quisquam nemo porro consequatur. Explicabo neque sunt ducimus consectetur error magnam doloremque illum eius sequi modi beatae consequatur, nulla aut in quasi voluptatibus. Pariatur modi porro culpa. Eos.",
    },
    {
      type: "user",
      message:
        "Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful Analysis.",
    },
    {
      type: "bot",
      message:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente nemo ipsum dolore unde, cum vel obcaecati enim? Provident cupiditate earum eius velit quisquam nemo porro consequatur. Explicabo neque sunt ducimus consectetur error magnam doloremque illum eius sequi modi beatae consequatur, nulla aut in quasi voluptatibus. Pariatur modi porro culpa. Eos.",
    },
    {
      type: "user",
      message:
        "Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful Analysis.",
    },
    {
      type: "bot",
      message:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente nemo ipsum dolore unde, cum vel obcaecati enim? Provident cupiditate earum eius velit quisquam nemo porro consequatur. Explicabo neque sunt ducimus consectetur error magnam doloremque illum eius sequi modi beatae consequatur, nulla aut in quasi voluptatibus. Pariatur modi porro culpa. Eos.",
    },
  ];

  return (
    <div className="row-start-2 row-end-3 overflow-y-auto flex flex-col gap-2">
      {chats.map((chat, index) => {
        return (
          <div key={index}>
            {chat.type === "user" && (
              <Card className="sm:col-span-2 shadow-none ml-10 mr-2 bg-secondary ">
                <CardHeader className="p-3">
                  <CardDescription className="max-w-lg">
                    {chat.message}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {chat.type === "bot" && (
              <Card className="sm:col-span-2 shadow-none mr-10">
                <CardHeader className="p-3">
                  <CardDescription className="max-w-lg">
                    {chat.message}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;
